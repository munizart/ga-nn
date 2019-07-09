/**
 * ActivationFunction -
 * given a x, decides which y to output
 * used in the activation phase of nodes.
 */
export type ActivationFunction = (x: number) => number

/**
 * Rectified linear units activation function.
 */
export const ReLU : ActivationFunction =
  x => Math.max(0, x)
/**
 *  Hyperbolic tangent activation function.
 */
export const Tanh : ActivationFunction =
  x => (2 / (1 + Math.exp(-2 * x))) - 1

export const allActivations : [
  'ReLU',
  'Tanh'
] = [
  'ReLU',
  'Tanh'
]
