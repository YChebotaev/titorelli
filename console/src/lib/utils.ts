import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mapFilter<T, U>(
  array: T[],
  callback: (element: T, index: number, array: T[]) => U | null | undefined
): NonNullable<U>[] {
  return array.map(callback).filter((result): result is NonNullable<U> => result != null);
}

export async function mapFilterAsync<T, U>(
  array: T[],
  callback: (element: T, index: number, array: T[]) => Promise<U | null | undefined>
): Promise<NonNullable<U>[]> {
  // First, map over the array and execute all callbacks concurrently
  const results = await Promise.all(array.map(callback));

  // Then, filter out nullish values
  return results.filter((result): result is NonNullable<Awaited<U>> => result != null);
}
