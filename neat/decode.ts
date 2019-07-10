import { Node, methods, architect } from 'neataptic'
import { Genome } from './genome';
import { Connection } from './connection';

const isExpressed = (genome: Genome) => function expressedConnection (connection: Connection) : boolean {
  const { enabled, from, to } = connection
  if (!enabled) {
    return false
  }
  return genome.nodes.some(({ id }) => id === from) && genome.nodes.some(({ id }) => id === to)
}

export function decode(genome: Genome) {
  const nodes = genome.nodes.reduce((allNodes: any, node) => {
    if (!node) {
      throw TypeError('Invalid node in genome')
    }
    const n = new Node(node.type)
    n.squash = methods.activation[node.activation]
    n.bias = node.bias
    n.__id = node.id
    allNodes[node.id] = n
    return allNodes
  }, {})


  genome.connections
    .filter(isExpressed(genome))
    .forEach(connection => {
      if (connection.enabled) {
        const from : Node = nodes[connection.from]
        const   to : Node = nodes[connection.to]

        from.connect(to, connection.weight)
      }
    })

  const network = architect.Construct(Object.values(nodes))
  if (network.input !== genome.inputs) {
    throw Error('inputs differ')
  }

  if (network.output !== genome.outputs) {
    throw Error('outputs differ')
  }

  return network
}