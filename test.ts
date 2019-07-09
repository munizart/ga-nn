import { mutateGenome, Genome } from "./genome";
const g1 = Genome(2, 2)
console.log(mutateGenome('REM_CONN', mutateGenome('ADD_CONN', mutateGenome('ADD_NODE', mutateGenome('ADD_NODE', g1)))).connections)