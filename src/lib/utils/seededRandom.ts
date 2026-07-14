const INITIAL_HASH = 0x811c9dc5;
export const seededRandom = (seed: string): number => {
  let hash = INITIAL_HASH;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) | 0;
  }
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x45d9f3b) | 0;
  hash ^= hash >>> 16;
  return (hash >>> 0) / 0x100000000;
};
