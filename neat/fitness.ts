import { FixedSizeArray } from "../types/FixedLengthArray"
import { Genome } from "./genome"
import { decode } from './decode';

export type FitnessFunction<I extends number, O extends number> = <II extends I, OO extends O>(a: Genome) => number
export function fitnessForData<I extends number, O extends number>(growth: number, data: {input: FixedSizeArray<number, I>, output: FixedSizeArray<number, O>}[]) {
  return function sumOfErrors (genome: Genome, g = 1) {
    try {
      const network = decode(genome)
      const { error } = network.test(data)
      if (g) {
        return (genome.nodes.length + (genome.connections.length * 2))
      }
      return - error + ((genome.nodes.length + genome.connections.length) * growth * g)
    } catch {
      return -1000 // dead
    }

  } as FitnessFunction<I, O>
}