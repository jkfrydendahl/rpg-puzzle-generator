/**
 * Seedable random number utilities for deterministic puzzle generation.
 *
 * Uses a simple mulberry32 PRNG so puzzles can be reproduced from a seed.
 */

export type Rng = () => number;

/** Create a seeded PRNG (mulberry32). */
export function createRng(seed: number): Rng {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Pick a random element from an array. */
export function pick<T>(arr: readonly T[], rng: Rng): T {
  return arr[Math.floor(rng() * arr.length)];
}

/** Shuffle an array in place (Fisher-Yates). Returns the same array. */
export function shuffle<T>(arr: T[], rng: Rng): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Pick `count` unique random elements from an array. */
export function pickN<T>(arr: readonly T[], count: number, rng: Rng): T[] {
  const copy = [...arr];
  shuffle(copy, rng);
  return copy.slice(0, Math.min(count, copy.length));
}

/** Random integer in [min, max] (inclusive). */
export function randomInt(min: number, max: number, rng: Rng): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}
