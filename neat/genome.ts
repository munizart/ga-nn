import { Connection, mutateConnection } from './connection';
import { GeneticNode, mutateNode } from "./genetic-node";
import { ValueFrom } from "../types/ValueFrom";
import { pickRandom, int, range } from '../rand/rand';


export interface Genome {
  inputs: number
  outputs: number

  connections: Connection[]
  nodes: GeneticNode[]
}

export const genomeMutations : [
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


function getConnectionMatrix(genome: Genome) {
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

export function mutateGenome(mutation: GenomeMutation, originalGenome: Genome): Genome {
  const genome: Genome = JSON.parse(JSON.stringify(originalGenome))

  if (mutation === 'ADD_CONN') {
    var connectionsMapping = getConnectionMatrix(genome)
    var available = genome.nodes
      .filter(node => !(node.type === 'output'))  // output dosen't have outgoing connections
      .flatMap(({ id: id1 }) => {
        return genome.nodes
          .flatMap(({ id: id2, type }) => {
            const isInput = type === 'input' // input dosen't have incooming connections
            const isConnected = connectionsMapping[id1] && connectionsMapping[id1][id2]
            const isReflexive = connectionsMapping[id2] && connectionsMapping[id2][id1]
            const isSame = id1 === id2
            const isAvailable = !isConnected && !isSame && !isInput && !isReflexive
            return isAvailable ? [[id1, id2]] : []
          })
      })

    if (available.length === 0) {
      return genome
    }

    var [from, to] = pickRandom(available)

    genome.connections.push(Connection(from, to, true))
    return genome
  }

  if (mutation === 'MOD_BIAS' || mutation === 'MOD_ACTV') {
    const node = pickRandom(
      genome.nodes.filter(node => node.type !== 'input')
    )
    const index = genome.nodes.indexOf(node)
    if (index > -1 && node) {
      genome.nodes.splice(
        index,
        1,
        mutateNode(mutation, node)
      )
    }
    return genome

  }

  if (mutation === 'ADD_NODE') {
    function findConnection (from, to) {
      return genome.connections.find(connection => connection.from === from && connection.to === to)
    }

    function connect(from, to) {
      const conn = findConnection(from, to)
      if (conn) {
        conn.enabled = true
      } else {
        genome.connections.push(Connection(from, to, true))
      }
    }

    const connection = pickRandom(genome.connections.filter(c => c.enabled))
    connection.enabled = false

    const toIndex = genome.nodes.findIndex(({ id }) => id === connection.to)
    const node = GeneticNode(Math.max(...genome.nodes.map(x => x.id)) + 1, 'hidden')

    const minBound = Math.min(toIndex, genome.nodes.length - genome.outputs)

    genome.nodes.splice(minBound, 0, node)

    connect(connection.from, node.id)
    connect(node.id, connection.to)

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
      acc.outgoings[from] = (acc.outgoings[from] || 0) + 1
      acc.incomings[to] = (acc.incomings[to] || 0) + 1

      return acc
    }, {
        outgoings: [] as number[],
        incomings: [] as number[],
      })

    const posibilities = genome.connections.filter(
      connection => countings.outgoings[connection.from] > 1 && countings.incomings[connection.to] > 1
    )

    if (!posibilities.length) {
      return genome
    } else {
      genome.connections.splice(
        genome.connections.indexOf(pickRandom(posibilities)),
        1
      )
    }
    return genome
  }

  if (mutation === 'REM_NODE') {
    const nodes = genome.nodes.filter(node => node.type === 'hidden')
    if (nodes.length < 1) {
      return genome
    }

    // Select a node which isn't an input or output node
    const node = pickRandom(nodes)

    var connectionsMapping = getConnectionMatrix(genome)
    genome.connections = genome.connections.concat(genome.connections

      .filter(({ to }) => to === node.id) // inputs of this node

      .flatMap(({ from }) => {
        return genome.connections
          .filter(({ from }) => from === node.id) // outputs of this node
          .flatMap(({ to }) => {
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
    genome.nodes.splice(genome.nodes.indexOf(node), 1)
    return genome
  }

  throw TypeError(`Unsuported genome mutation: ${mutation}`)
}

export function Genome(inputs: number, outputs: number) {
  const nodes = Array.from({
    length: inputs as any + outputs as any
  }, (_: any, id: number) => GeneticNode(id, id < inputs ? 'input' : 'output'))

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