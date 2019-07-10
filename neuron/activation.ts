/**
 * given a x, decides which y to output.
 *
 * used in the activation phase of nodes.
 */
export type ActivationFunction = (x: number) => number

/**
 *
 */
export const allActivations : [
  "LOGISTIC",
  "TANH",
  "IDENTITY",
  "STEP",
  "RELU",
  "SOFTSIGN",
  "SINUSOID",
  "GAUSSIAN",
  "BENT_IDENTITY",
  "BIPOLAR",
  "BIPOLAR_SIGMOID",
  "HARD_TANH",
  "ABSOLUTE",
  "INVERSE",
  "SELU"
] = [
  "LOGISTIC",
  "TANH",
  "IDENTITY",
  "STEP",
  "RELU",
  "SOFTSIGN",
  "SINUSOID",
  "GAUSSIAN",
  "BENT_IDENTITY",
  "BIPOLAR",
  "BIPOLAR_SIGMOID",
  "HARD_TANH",
  "ABSOLUTE",
  "INVERSE",
  "SELU"
]
