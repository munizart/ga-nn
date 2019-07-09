import { Connection, mutateConnection } from "./connection";
import { GeneticNode, mutateNode } from "./genetic-node";
import { ValueFrom } from "./types/ValueFrom";
import { pickRandom, range, int } from "./rand/rand";


export interface Genome<
  Inputs extends number,
  Outputs extends number
  > {
  inputs: number
  outputs: number

  connections: Connection[]
  nodes: GeneticNode[]
}

export const genomeMutations: [
  'ADD_NODE', 'REM_NODE',
  'MOD_BIAS', 'MOD_ACTV',
  'ADD_CONN', 'REM_CONN',
  'MOD_WEIGHT'
] = [
    //nodes
    'ADD_NODE', 'REM_NODE',
    'MOD_BIAS', 'MOD_ACTV',

    //connections
    'ADD_CONN', 'REM_CONN',
    'MOD_WEIGHT',
  ]

function getConnectionMatrix(genome: Genome<any, any>) {
  return genome.connections.reduce(
    (acc: boolean[][], { to, from }) => {
      acc[from] = acc[from] || []
      acc[from][to] = true
      return acc
    },
    [[]]
  )
}

export type GenomeMutation = ValueFrom<typeof genomeMutations>
export function mutateGenome<I extends number, O extends number>(mutation: GenomeMutation, originalGenome: Genome<I, O>): Genome<I, O> {
  const genome: Genome<I, O> = JSON.parse(JSON.stringify(originalGenome))

  if (mutation === 'ADD_CONN') {
    var connectionsMapping = getConnectionMatrix(genome)

    var available = genome.nodes
      .slice(0, genome.nodes.length - genome.outputs)
      .flatMap(({ id: id1 }, index) => {
        return genome.nodes.slice(Math.max(index + 1, genome.inputs))
          .flatMap(({ id: id2 }) => {
            if (!connectionsMapping[id1][id2]) {
              return [[id1, id2]]
            }
            return []
          })
      })

    if (available.length === 0) {
      console.warn('No more connections to be made!')
    }

    var [from, to] = pickRandom(available)
    genome.connections.push(Connection(from, to, true))
    return genome
  }

  if (mutation === 'MOD_BIAS' || mutation === 'MOD_ACTV') {
    const index = range(genome.inputs, genome.nodes.length)
    genome.nodes.splice(
      index,
      1,
      mutateNode(mutation, genome.nodes[index])
    )
    return genome
  }

  if (mutation === 'ADD_NODE') {
    const connection = pickRandom(genome.connections)
    connection.enabled = false

    const toIndex = genome.nodes.findIndex(({ id }) => id === connection.to)
    const node = GeneticNode(Math.max(...genome.nodes.map(x => x.id)) + 1)

    const minBound = Math.min(toIndex, genome.nodes.length - genome.outputs)
    genome.nodes.splice(minBound, 0, node)

    genome.connections.push(
      Connection(connection.from, node.id, true),
      Connection(node.id, connection.to, true)
    )

    return genome
  }

  if (mutation === 'MOD_WEIGHT') {
    const index = int(genome.connections.length)
    genome.connections.splice(
      index,
      1,
      mutateConnection(mutation, genome.connections[index])
    )
    return genome
  }

  if (mutation === 'REM_CONN') {
    const countings = genome.connections.reduce((acc, { from, to }) => {
      acc.outgoings[from] = (acc.outgoings[from] || 0 ) + 1
      acc.incomings[to] = (acc.incomings[to] || 0 ) + 1

      return acc
    }, {
      outgoings: [] as number [],
      incomings: [] as number [],
    })

    const posibilities = genome.connections.filter(
      connection => countings.outgoings[connection.from] > 1 && countings.incomings[connection.to] > 1
    )

    if (!posibilities.length) {
      console.warn('No more connections to remove')
    } else {
      genome.connections.splice(
        genome.connections.indexOf(pickRandom(posibilities)),
        1
      )
    }
    return genome
  }

  if (mutation === 'REM_NODE') {
    if (genome.nodes.length <= genome.inputs + genome.outputs) {
      console.warn('No more nodes left to remove! aborting mutation')
    }

    // Select a node which isn't an input or output node
    const hiddens = genome.nodes.length - genome.outputs - genome.inputs
    const index = range(genome.inputs, hiddens)
    const node = genome.nodes[index]
    
    var connectionsMapping = getConnectionMatrix(genome)
    genome.connections = genome.connections.concat(genome.connections
      
      .filter(({ to }) => to === node.id) // inputs of this node
      
      .flatMap(({ from }) => {
        return genome.connections
          .filter(({ from }) => from === node.id) // outputs of this node
          .flatMap(({ to }) => {
            console.log(from, to)
            const connection = genome.connections.find(c => c.to === to && c.from === from)
            if (connection) {
              // ensure connection...
              connection.enabled = true
              return []
            } else {
              // ...or create a new one
              return [Connection(from, to, true)]
            }
          })
      })
    )

    // finally remove the node
    genome.nodes.splice(index, 1)
    return genome
  }

  throw TypeError(`Unsuported genome mutation: ${mutation}`)
}

export function Genome<I extends number, O extends number>(inputs: I, outputs: O): Genome<I, O> {
  const nodes = Array.from({
    length: inputs as any + outputs as any
  }, (_: any, id: number) => GeneticNode(id))

  const connections = nodes.slice(0, inputs).flatMap((inputNode: GeneticNode) =>
    nodes.slice(inputs).map((outputNode: GeneticNode) => Connection(
      inputNode.id,
      outputNode.id,
      true
    )))

  return {
    nodes,
    connections,
    inputs,
    outputs
  }
}