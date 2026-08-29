export function createSeededRandomFromHash(hexHash: string): () => number {
  let state = 2166136261 >>> 0;

  for (let position = 0; position < hexHash.length; position++) {
    state ^= hexHash.charCodeAt(position);
    state = Math.imul(state, 16777619) >>> 0;
  }

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
