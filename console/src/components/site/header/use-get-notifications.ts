import { useState, useCallback } from 'react'
import { Notification } from '@/types/notifications'

const ITEMS_PER_PAGE = 10

// Helper to generate dates from now
const getDateFromNow = (hoursAgo: number) => {
  const date = new Date()
  date.setHours(date.getHours() - hoursAgo)
  return date
}

// Generate initial notifications
const generateInitialNotifications = (): Notification[] => {
  const notifications: Notification[] = [
    // Today's notifications
    ...Array.from({ length: 12 }, (_, i) => ({
      id: `today-${i}`,
      userId: `user${i}`,
      userName: `User ${i}`,
      action: "Invited",
      target: "Alisa Hester to the team",
      timestamp: getDateFromNow(i),
      read: false,
    })),
    // Yesterday's notifications
    ...Array.from({ length: 8 }, (_, i) => ({
      id: `yesterday-${i}`,
      userId: `user${i + 12}`,
      userName: `User ${i + 12}`,
      action: "Invited",
      target: "John Doe to the team",
      timestamp: getDateFromNow(24 + i),
      read: false,
    })),
    // 2 days ago notifications
    ...Array.from({ length: 8 }, (_, i) => ({
      id: `2days-${i}`,
      userId: `user${i + 20}`,
      userName: `User ${i + 20}`,
      action: "Invited",
      target: "Jane Smith to the team",
      timestamp: getDateFromNow(48 + i),
      read: false,
    })),
  ]

  return notifications
}

export function useGetNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>(generateInitialNotifications)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  const loadMore = useCallback(async () => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newNotifications: Notification[] = Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => ({
      id: `loaded-${page}-${i}`,
      userId: `user${page * 10 + i}`,
      userName: `User ${page * 10 + i}`,
      action: "Invited",
      target: "someone to the team",
      timestamp: getDateFromNow(72 + page * 24 + i),
      read: false,
    }))

    setNotifications((prev) => [...prev, ...newNotifications])
    setPage((p) => p + 1)
    setHasMore(page < 5) // Limit to 5 pages for demo
  }, [page])

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  return {
    notifications,
    hasMore,
    markAsRead,
    markAllAsRead,
    loadMore,
  }
}

