import { ValueFrom } from "./types/ValueFrom";
import { allActivations } from "./neuron/activation";
import { pickRandom, range } from "./rand/rand";

export interface GeneticNode {
  bias: number
  id: number
  activation: ValueFrom<typeof allActivations>
}

export const nodeMutations : [
  'MOD_BIAS',
  'MOD_ACTV'
] = [
  'MOD_BIAS',
  'MOD_ACTV'
]

export type NodeMutation = ValueFrom<typeof nodeMutations>
export function mutateNode (mutation: NodeMutation, node: GeneticNode) : GeneticNode {
  if (mutation === 'MOD_ACTV') {
    return {
      ...node,
      // chose a new activation function
      activation: pickRandom(allActivations.filter(
        x => x !== node.activation
      ))
    }
  }

  if (mutation === 'MOD_BIAS') {
    return {
      ...node,
      bias: node.bias + range(-1, 1)
    }
  }

  throw new TypeError (`Unsupported node mutation: ${mutation}`)
}

export function GeneticNode (id: number) : GeneticNode {
  return {
    id,
    bias: range(-1, 1),
    activation: pickRandom(allActivations)
  }
}