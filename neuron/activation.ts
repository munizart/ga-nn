/**
 * given a x, decides which y to output.
 *
 * used in the activation phase of nodes.
 */
export type ActivationFunction = (x: number) => number

/**
 * Rectified linear units activation function.
 */
export const ReLU : ActivationFunction = x => Math.max(0, x)

/**
 *  Hyperbolic tangent activation function.
 */
export const Tanh : ActivationFunction = Math.tanh

/**
 * Identity function, dosen't do a thing.
 */
export const Identity : ActivationFunction = x => x

/**
 * Step activation, looks like a extremist ReLu.
 */
export const Step : ActivationFunction = x => x > 0 ? 1 : 0;

/**
 * Inverse activation function
 */
export const Inverve : ActivationFunction = x => 1 - x

/**
 * Gaussian activation function
 */
export const Gaussian : ActivationFunction = x => Math.exp(-Math.pow(x, 2))

/**
 *
 */
export const allActivations : [
  'ReLU',
  'Tanh',
  'Identity',
  'Step',
  'Inverse',
  'Gaussian'
] = [
  'ReLU',
  'Tanh',
  'Identity',
  'Step',
  'Inverse',
  'Gaussian'
]
