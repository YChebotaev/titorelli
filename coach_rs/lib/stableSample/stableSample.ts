import { stableRandomSort } from './stableRandomSort'

export const stableSample = <T>(array: T[], count: number, seed: number): T[] => {
  return stableRandomSort(array, seed).slice(0, count)
}
