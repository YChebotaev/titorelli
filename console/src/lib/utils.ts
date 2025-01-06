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

import { Notification, NotificationGroup } from "@/types/notifications"

export function formatTimeAgo(date: Date): string {
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return "Just now"
  if (minutes < 60) return `${minutes} mins ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export function groupNotifications(notifications: Notification[]): NotificationGroup[] {
  const groups: Record<string, Notification[]> = {}
  const now = new Date()

  notifications.forEach((notification) => {
    const date = new Date(notification.timestamp)
    const isToday = date.toDateString() === now.toDateString()
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString()

    let groupKey
    if (isToday) {
      groupKey = "Today"
    } else if (isYesterday) {
      groupKey = "Yesterday"
    } else {
      const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
      groupKey = `${days} days ago`
    }

    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(notification)
  })

  return Object.entries(groups).map(([label, notifications]) => ({
    label,
    notifications
  }))
}
