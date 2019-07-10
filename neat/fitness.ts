import { FixedSizeArray } from "../types/FixedLengthArray"
import { Genome } from "./genome"
import { Node, methods, architect } from 'neataptic'

export function fitnessForData<I extends number, O extends number>(data: {input: FixedSizeArray<number, I>, output: FixedSizeArray<number, O>}[]) {
  return (genome: Genome<I, O>) => {
    const nodes = genome.nodes.reduce((allNodes: any, node) => {
      const n = new Node(node.type)
      n.squash = methods.activation[node.activation]
      n.bias = node.bias

      allNodes[node.id] = n
      return allNodes
    }, {})
    
    genome.connections.forEach(connection => {
      if (connection.enabled) {
        const from : Node = nodes[connection.from]
        const   to : Node = nodes[connection.to]
        from.connect(to, connection.weight)
      }
    })

    try {
      const network = architect.Construct(Object.values(nodes))
    } catch (error) {
      console.log(Object.values(nodes))
      process.exit(0)
    }
    const { error } = network.test(data)
    let score = -error

    //score -= (genome.nodes.length - genome.inputs - genome.outputs + genome.connections.length) * 0.001
    score = isNaN(score) ? -Infinity : score // this can cause problems with fitness proportionate selection

    return score
  }
}