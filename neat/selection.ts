import { Genome, mutateGenome, genomeMutations, genomeMutationsNames } from "./genome";
import { range, pickRandom, intRange } from "../rand/rand";
import { SelectionData, crossover } from "./crossover";

interface EvolutionOptions {
  elitism: number
  mutationRate: number
  mutationAmout: number
  popSize?: number
  maxGenerations: number
  fitnessFunction: <I extends number, O extends number>(a: Genome<I,O>) => number
}
const compare = (a: any, b: any) => {
  return a.fitness - b.fitness // the greatest the number, the most fit.
}

const dataFrom = ({ fitnessFunction } : EvolutionOptions) => (genome : Genome<any,any>) => ({
  fitness: fitnessFunction(genome),
  genome
})

export async function breed<
  I extends number,
  O extends number
>(
  population: Genome<I,O>[],
  options: EvolutionOptions
) : Promise<Genome<I,O>[]> {
  console.time('populationWithData')
  const populationWithData = population.map(dataFrom(options)).sort(compare)
  console.timeEnd('populationWithData')

  await nextTick()
  
  console.time('selection')
  const elite = population.slice(0, options.elitism)
  const mating_pool = select(populationWithData, population.length - options.elitism + 1)
  if (elite.length + mating_pool.length !== populationWithData.length + 1) {
    console.log(elite.length, mating_pool.length, populationWithData.length)
    process.exit()
  }
  await nextTick()
  console.timeEnd('selection')

  console.log('fitness: %s', populationWithData[0].fitness)

  const newBread = mating_pool
    .slice(0, -1)
    .map((g1, i) => {
      const g2 = mating_pool[i + 1]
      return crossover(g1, g2)
    })
    .map(mutate(options.mutationRate, options.mutationAmout))
  
  await nextTick()
  
  const newPop = elite.concat(newBread)
  if (newPop.length !== populationWithData.length) {
    console.log('>', elite.length, mating_pool.length, populationWithData.length)
    process.exit()
  }
}

function select (popData: SelectionData<any,any>[], count: number, skip?: SelectionData<any,any>) : SelectionData<any, any>[] {
  if (count === 0 || popData.length === 0) {
    return []
  } else {
    const totalFitness = popData.reduce(
      (totalFitness, { fitness }) => fitness + totalFitness,
      0
    )
    let credits = range(0, totalFitness)
    let i = -1
    while (credits < 0) {
      i++
      credits = credits - popData[i].fitness
    }
    if (i >= popData.length) {
      i = popData.length - 1
    }

    const chossen = popData[i]

    popData.splice(i, 1)
    if (skip) {
      popData.push(skip)
    }

    return [chossen, ...select(popData, count -1, chossen)]
  }
}


export async function evolve<
  I extends number,
  O extends number
>(
  inputs: I,
  outputs: O,
  options: EvolutionOptions
) {
  console.log('starting evolution.', ...Object.entries(options).flat())
  const fistGen = Array.from({
    length: options.popSize || 20
  }, () => Genome(inputs, outputs))
  
  await nextTick()
  let pop = fistGen
  while(options.maxGenerations--) {
    console.log('Starting %s', options.maxGenerations+1)
    pop = await breed(pop, options)
    await nextTick()
    console.log('breed %s; %s generations to go', pop.length, options.maxGenerations, pop)
  }

  return pop.map(dataFrom(options)).sort(compare).shift()
}

const mutate = (mutationRate: number, mutationAmout: number) => function (genome: Genome<any, any>) : Genome<any, any> {
  if (mutationRate < range(0, 1)) {
    while(mutationAmout-- > 0) {
      const total = genomeMutations.reduce((c, [, a]) => c + a, 0)
      let i = 0
      let credits = range(0, total)
      while (credits > 0) {
        credits -= genomeMutations[i][1]
        i++
      }
      const mutationName = genomeMutationsNames[i]
      if (mutationName) {
        console.info('mutating node, %s', mutationName)
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