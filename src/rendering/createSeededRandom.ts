export function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;

  if (state === 0) {
    state = 1;
  }

  return function nextRandomNumber(): number {
    state ^= state << 13;
    state >>>= 0;
    state ^= state >> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 4294967296;
  };
}
