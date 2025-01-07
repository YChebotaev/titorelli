import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import { HeaderNotificationVm } from '@/types/user-notification'
import type { PaginatedItems } from '@/types/paginated-items'

const unwrapNotifications = (data: InfiniteData<PaginatedItems<HeaderNotificationVm>> | undefined) => {
  if (data == null)
    return []

  return data.pages.flatMap(({ items }) => items)
}

export function useGetNotifications(userId: string) {
  const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ['users', userId, 'notifications'],
    initialPageParam: 0,
    async queryFn({ pageParam }) {
      const resp = await fetch(`/api/users/${userId}/notifications`, {
        method: 'POST',
        body: JSON.stringify({ page: pageParam, size: 40 }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await resp.json() as Awaited<PaginatedItems<HeaderNotificationVm>>

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

  return {
    notifications: unwrapNotifications(data),
    hasMore: hasNextPage,
    isLoading,
    markAsRead() { },
    markAllAsRead() { },
    loadMore() {
      fetchNextPage()
    },
  }
}
