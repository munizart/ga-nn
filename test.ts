import 'babel-polyfill'

import { fitnessForData } from './neat/fitness';
import { evolve } from './neat/selection';

const fitnessFunction = fitnessForData([
  { input: [0,0], output: [1, 0] },
  { input: [0,1], output: [0, 0] },
  { input: [1,0], output: [0, 0] },
  { input: [1,1], output: [1, 1] },
])

evolve(2, 2, {
  elitism: 0,
  popSize: 30,
  fitnessFunction,
  maxGenerations: 200,
  mutationAmout: 10,
  mutationRate: .4
}).catch(error => {
  console.error(error)
}).then(data => {
  console.log('Trained!', data.fitness, data.genome)
})