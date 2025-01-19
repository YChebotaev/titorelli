import { useMemo, useCallback } from 'react'
import { InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { HeaderNotificationVm } from '@/types/user-notification'
import type { PaginatedItems } from '@/types/paginated-items'
import { useApiClient } from './use-api-client'

const unwrapNotifications = (data: InfiniteData<PaginatedItems<HeaderNotificationVm>> | undefined) => {
  if (data == null)
    return []

  return data.pages.flatMap(({ items }) => items)
}

export function useGetNotifications(userId: string) {
  const axios = useApiClient()
  const queryClient = useQueryClient()
  const queryKey = useMemo(() => ['users', userId, 'notifications'], [userId])
  const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey,
    initialPageParam: 0,
    async queryFn({ pageParam }) {
      const { data } = await axios.post<PaginatedItems<HeaderNotificationVm>>(`/api/users/${userId}/notifications`, { page: pageParam, size: 40 })

      return data
    },
    getNextPageParam(lastPage, allPages, pageParam) {
      const { total } = lastPage
      const cumulativeLength = allPages.reduce((l, { length }) => l + length, 0)

      if (total <= cumulativeLength) {
        return undefined
      }

      return pageParam + 1
    },
    getPreviousPageParam() {
      return undefined
    }
  })

  const receiveNotifications = useCallback(
    async (ids: string[]) => {
      await axios.post(`/api/users/${userId}/notifications/receive`, { ids })

      await queryClient.invalidateQueries({ queryKey })
    },
    [userId, queryKey, queryClient, axios]
  )

  const notifications = useMemo(() => unwrapNotifications(data), [data])

  const markAsRead = useCallback((id: string) => {
    return receiveNotifications([id])
  }, [receiveNotifications])

  const markAllAsRead = useCallback(() => {
    return receiveNotifications(notifications.map(({ id }) => id))
  }, [receiveNotifications, notifications])

  return useMemo(() => ({
    notifications,
    hasMore: hasNextPage,
    isLoading,
    markAsRead,
    markAllAsRead,
    loadMore: fetchNextPage,
  }), [
    notifications,
    hasNextPage,
    isLoading,
    markAsRead,
    markAllAsRead,
    fetchNextPage
  ])
}
