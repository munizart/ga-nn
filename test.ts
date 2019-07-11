import 'babel-polyfill'

import { fitnessForData } from './neat/fitness';
import { evolve } from './neat/selection';
import { decode } from './neat/decode';
import { printGenome } from './viz/genome-viz';
import trainSet from './data.json'
import _ from 'lodash'

/*
const trainSet : any = [
  { input: [0,0], output: [0] },
  { input: [0,1], output: [1] },
  { input: [1,0], output: [1] },
  { input: [1,1], output: [0] },
] */
const fitnessFunction = fitnessForData(-0.01, trainSet)
const options = {
  elitism: 0,
  popSize: 200,
  fitnessFunction,
  maxGenerations: 1000,
  mutationAmout: 4,
  mutationRate: .4,
  targetError: .02
}

evolve(4, 3, options).then(summary).catch(error => {
  console.error(error)
})

function summary (data) {
  if (!data) {
    return
  }
  console.log('Trained!, final fitness %f', data.fitness)
  const network = decode(data.genome)
  const { error } = network.test(trainSet)

  console.log(JSON.stringify(data.genome))

  _.shuffle(trainSet).slice(0,4).forEach(({input, output}) => {
    console.log(input, network.activate(input), output)
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
