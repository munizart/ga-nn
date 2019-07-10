import { Connection } from './connection';
import { intRange } from '../rand/rand';
import { Genome } from './genome';

const copy = <T>(x: T) => JSON.parse(JSON.stringify(x)) as T

export interface SelectionData {
  genome: Genome
  fitness: number
}

export function crossover (parentAData: SelectionData, parentBData: SelectionData) : Genome {
  // be sure that A's fitnness is GTE than B's
  if (parentBData.fitness > parentAData.fitness) {
    return crossover (parentBData, parentAData)
  }

  const innovations : Record<number, Connection> = parentBData.genome.connections.reduce((acc: Record<number, Connection>, conn) => ({
    ...acc,
    [conn.innovation]: conn
  }), {})

  const child = copy(parentAData.genome)
  child.connections = parentAData.genome.connections.map(parentAConn => {
    const parentBConn = innovations[parentAConn.innovation]
    if (parentBConn && parentBConn.enabled && intRange(0,1)) {
      return copy(parentBConn)
    } else {
      return copy(parentAConn)
    }
  })

  if (parentAData.fitness === parentBData.fitness) {
    child.connections.push(
      ...parentBData.genome.connections.filter(
        ({innovation}) => !child.connections.find(c => c.innovation === innovation)
      )
    )
  }

  return child
}