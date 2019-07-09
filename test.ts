import { mutateGenome, Genome, GenomeMutation } from './neat/genome';
import { Connection, mutateConnection } from './dist/neat/connection';
import { crossover } from './neat/crossover';

const c1_4 = Connection(1, 4, true)
const c2_4 = Connection(2, 4, false)
const c3_4 = Connection(3, 4, true)
const c2_5 = Connection(2, 5, true)
const c5_4 = Connection(5, 4, true)
const c5_4_disbled = {...c5_4, enabled: false}
const c1_5 = Connection(1, 5, true)

const c5_6 = Connection(5, 6, true)
const c6_4 = Connection(6, 4, true)
const c3_5 = Connection(3, 5, true)
const c1_6 = Connection(1, 6, true)

const g1 : Genome<3,1> = {
  nodes: [
    { id: 1, bias: 0.8640920452708087, activation: 'Inverse' },
    { id: 2, bias: 0.8640920452708087, activation: 'Inverse' },
    { id: 3, bias: 0.8640920452708087, activation: 'Inverse' },
    { id: 5, bias: 0.8640920452708087, activation: 'Inverse' },
    { id: 4, bias: 0.8640920452708087, activation: 'Inverse' },
  ],
  connections: [
    c1_4, c2_4, c3_4, c2_5, c5_4, c1_5
  ],
  inputs: 3,
  outputs: 1
}

const g2 : Genome<3,1> = {
  nodes: [
    { id: 1, bias: 0.8640920452708087, activation: 'Inverse' },
    { id: 2, bias: 0.8640920452708087, activation: 'Inverse' },
    { id: 3, bias: 0.8640920452708087, activation: 'Inverse' },
    { id: 5, bias: 0.8640920452708087, activation: 'Inverse' },
    { id: 4, bias: 0.8640920452708087, activation: 'Inverse' },
  ],
  connections: [
    c1_4, c2_4, c3_4, c2_5, c5_4_disbled, c5_6, c6_4, c3_5, c1_6
  ],
  inputs: 3,
  outputs: 1
}

console.log(crossover(
  { genome: g1, fitness: 0 },
  { genome: g2, fitness: 0 }
))