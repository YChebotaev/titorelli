import { DeterministicRandom } from './DeterministicRandom'

export const stableRandomSort = <T>(array: T[], seed: number): T[] => {
  const rng = new DeterministicRandom(seed);

  return array
    .map(it => ({ r: rng.next(), it }))
    .sort(({ r: r1 }, { r: r2 }) => r1 - r2)
    .map(({ it }) => it)
}
