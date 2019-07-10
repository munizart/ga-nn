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
const compare = (a: any, b: any) => {
  return b.fitness - a.fitness // the greatest the number, the most fit.
}

const dataFrom = ({ fitnessFunction } : EvolutionOptions, g = 1) => (genome : Genome) => ({
  fitness: fitnessFunction(genome, g),
  genome
}) as SelectionData

export async function breed(population: Genome[], options: EvolutionOptions) : Promise<Genome[]> {
  const populationWithData = population.map(dataFrom(options)).sort(compare)

  await nextTick()

  const elite = population.slice(0, options.elitism)
  const mating_pool = select(populationWithData, population.length - options.elitism + 1)

  await nextTick()

  const newBread = mating_pool
    .slice(0, -1)
    .map((g1, i) => {
      const g2 = mating_pool[i + 1]
      if (!g1 || !g2) {
        debugger
      }
      return crossover(g1, g2)
    })
    .map(mutate(options.mutationRate, options.mutationAmout))

  await nextTick()
  return elite.concat(newBread)
}

function select (popData: SelectionData[], count: number, skip?: SelectionData) : SelectionData[] {
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
    pop = await breed(pop, options)

    const champion = pop.map(dataFrom(options, 0)).sort(compare).shift()
    gen++
    if (champion && (-champion.fitness <= options.targetError)) {
      console.log('target error reached. breaking.')
      break
    }
  }
  console.timeEnd('evolve cycle')
  console.log('Evolution endend after %s generations', gen)

  const data = pop.map(dataFrom(options, 0)).sort(compare).shift()
  data.generations = gen
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
    if (typeof process !== 'undefined' && process.nextTick) {
      process.nextTick(() => res())
    } else if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => res())
    }
  })
}