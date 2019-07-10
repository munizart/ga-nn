import 'babel-polyfill'

import { fitnessForData } from './neat/fitness';
import { evolve } from './neat/selection';
import { decode } from './neat/decode';
import { printGenome } from './viz/genome-viz';

const trainSet : any = [
  { input: [0,0], output: [0] },
  { input: [0,1], output: [1] },
  { input: [1,0], output: [1] },
  { input: [1,1], output: [0] },

  { input: [0,0], output: [0] },
  { input: [0,1], output: [1] },
  { input: [1,0], output: [1] },
  { input: [1,1], output: [0] },
]
const fitnessFunction = fitnessForData(0.01, trainSet)
const options = {
  elitism: 4,
  popSize: 200,
  fitnessFunction,
  maxGenerations: 1500,
  mutationAmout: 1,
  mutationRate: .01,
  targetError: .005
}

evolve(2, 1, options).then(summary).catch(error => {
  console.error(error)
})

function summary (data) {
  if (!data) {
    return
  }
  console.log('Trained!, final fitness %f', data.fitness)
  const network = decode(data.genome)
  const { error } = network.test(trainSet)

  console.log(network.nodes.map(x => x.type))

  trainSet.slice(0,4).forEach(({input, output}) => {
    console.log(input, network.activate(input)[0].toFixed(4), output[0])
  })

  if (typeof window !== 'undefined') {
    printGenome('#viz', data.genome)

    const dataElement = document.getElementById('data')
    if (dataElement) {
      dataElement.innerText = `
        Error: ${ error }
        Generations: ${ data.generations }
      `
      Object
        .entries(JSON.parse(JSON.stringify(options)))
        .forEach(([k, v]) => {
          dataElement.innerText += `${k}: ${(v && v.name) || v}\n`
        })
    }
  }
}
