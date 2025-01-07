import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mapAsync<T, U>(
  array: T[],
  callback: (element: T, index: number, array: T[]) => Promise<U>
): Promise<U[]> {
  return Promise.all(array.map(callback))
}

export function mapAsyncTry<T, U, E extends Error = Error>(
  array: T[],
  callback: (element: T, index: number, array: T[]) => Promise<U | E>
): Promise<(U | E)[]> {
  return Promise.all(array.map(async (element, index, array) => {
    try {
      return await callback(element, index, array);
    } catch (error) {
      return error as E;
    }
  }));
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

export function createArrayWithSingleValue<T>(v: T, i = 0): (T | undefined)[] {
  const result = Array(i + 1)

  result[i] = v

  return result
}

import type { HeaderNotificationGroupVm, HeaderNotificationVm } from "@/types/user-notification"
import { formatDistanceToNow } from "date-fns";
import { ru } from 'date-fns/locale/ru'

export function groupNotifications(notifications: HeaderNotificationVm[]): HeaderNotificationGroupVm[] {
  const groups: Record<string, HeaderNotificationVm[]> = {}
  
  for (const notification of notifications) {
    const { createdAt: createdAtStr } = notification
    const groupKey = formatDistanceToNow(createdAtStr, { locale: ru })

    groups[groupKey] = groups[groupKey]?.concat(notification) ?? [notification]
  }

  return Object.entries(groups).map(([label, notifications]) => ({ label, notifications }))
}
