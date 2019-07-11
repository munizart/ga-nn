import { Genome, mutateGenome, genomeMutations } from "./genome";
import { range, pickRandom } from "../rand/rand";
import { SelectionData, crossover } from "./crossover";
import { FitnessFunction } from './fitness';

import rouletteWheelSelection from 'roulette-wheel-selection'

interface EvolutionOptions <I extends number = number, O extends number = number> {
  elitism: number
  maxGenerations: number
  mutationAmout: number
  mutationRate: number
  popSize?: number
  targetError: number
  fitnessFunction: FitnessFunction<I,O>
}

let interrupt = false

const compare = (a: any, b: any) => {
  return b.fitness - a.fitness // the greatest the number, the most fit.
}

const dataFrom = ({ fitnessFunction } : EvolutionOptions, g = 1) => (genome : Genome) => ({
  fitness: fitnessFunction(genome, g),
  genome
}) as SelectionData

export async function breed(population: SelectionData[], options: EvolutionOptions) : Promise<Genome[]> {

  await nextTick()
  const elite = population.slice(0, options.elitism)
  const mating_pool = select(population.slice(options.elitism), population.length - options.elitism + 1)

  const newBread = mating_pool
    .slice(0, -1)
    .map((g1, i) => {
      /* const g2 = mating_pool[i + 1]
      if (!g1 || !g2) {
        debugger
      }
      return crossover(g1, g2) */
      return g1.genome
    })
    .map(mutate(options.mutationRate, options.mutationAmout))

  await nextTick()
  return elite.concat(newBread)
}

function select (popData: SelectionData[], count: number) : SelectionData[] {
  const getParent = () => rouletteWheelSelection(popData, 'fitness')
  const s = []
  while (s.length < count) {
    const chossen = getParent()
    if (chossen) {
      s.push(chossen)
    }
  }
  return s
}


export async function evolve<
  I extends number,
  O extends number
>(
  inputs: I,
  outputs: O,
  options: EvolutionOptions<I, O>
) {
  console.log('Starting evolution.\n', ...Object.entries(options).flat())
  console.time('evolve cycle')
  const fistGen = Array.from({
    length: options.popSize || 20
  }, () => Genome(inputs, outputs))


  await nextTick()
  let pop = fistGen
  let gen = 1
  while(gen <= options.maxGenerations) {
    const populationWithData = pop.map(dataFrom(options, 1)).sort(compare)
    pop = await breed(populationWithData, options)
    gen++

    const champion = populationWithData[0]

    const e = ({ fitness }) => fitness.toFixed(10)
    const error = -dataFrom(options, 0)(champion.genome).fitness
    const n = ({ genome }) => String(genome.nodes.length).padStart(2, ' ')
    const c = ({ genome }) => String(genome.connections.length).padStart(2, ' ')

    process.stdout.write(`\rGen# ${ gen } #1 ${e(champion)} n: ${n(champion)} c: ${c(champion)} ERROR: ${error}`)

    if (error && (error <= options.targetError)) {
      console.log('\ntarget error reached. breaking.')
      break
    }

    if (interrupt) {
      console.log('\ninterrupt')
      break
    }
  }
  console.log('\n')
  console.timeEnd('evolve cycle')
  console.log('Evolution endend after %s generations', gen)

  const data = pop.map(dataFrom(options, 0)).sort(compare).shift()
  data.generations = gen

  interrupt = false
  return data
}

const mutate = (mutationRate: number, mutationAmout: number) => function (genome: Genome) : Genome {
  if (mutationRate < range(0, 1)) {
    while(mutationAmout-- > 0) {

      const mutationName = pickRandom(genomeMutations)
      if (mutationName) {
        genome = mutateGenome(mutationName, genome)
      }
    }
  }

  return genome
}


function nextTick () {
  return new Promise((res, rej) => {
    setTimeout(() => res(), 0)
  })
}


process.addListener('SIGINT', () => {
  console.log('sigterm')
  interrupt = true
})