import { FixedSizeArray } from "../types/FixedLengthArray"
import { ActivationFunction } from "./activation"

/**
 * Neuron -
 * Constructs a new immutable neuron.
 * @param activationFn activation functions to use
 * @param wiegths a vector of weigths, must have the lenght L
 * @param bias the bias of this neuron
 */
export function neuron
  <L extends number> (
    activationFn: ActivationFunction,
    wiegths: FixedSizeArray<number, L>,
    bias: number
  ) : Neuron<L> {
    return function (inputs) {
      const value = inputs.reduce((result: number, input: number, index: number) => {
        return (result + input * wiegths[index])
      }, 0) + bias

      return activationFn (value)
    }
  }

export type Neuron<L extends number> = (inputs: FixedSizeArray<number, L>) => number