export function random (seed: number) : number {
  var x = Math.sin(.8765111159592828 + seed++) * 10000;

  return x - Math.floor(x);
}

let seed = 10
export function rndm () {
  seed = random(seed)
  return seed
}

export function int (max = 0xfffffff, random = rndm) {
  return (random() * max) | 0;
};

export function range (min = 0, max = 0xfffffff, random = rndm) {
  return random() * (max - min) + min
}

export function intRange (min = 0, max = 0xffffffe, random = rndm) {
  max = max + 1
  return int(max - min, random) + min;
}

export function pickRandom<T>(from: T[], random = rndm) : T {
  return from[intRange(0, from.length - 1, random)]
}

Math.random = rndm