import { useQuery } from "@tanstack/react-query"
import { type UnreadCountVm } from "@/types/user-notification"

export const useGetUnreadNotificationsCount = (userId: string) => {
  return useQuery({
    queryKey: ['users', userId, 'notifications', 'unread-count'],
    refetchInterval: 3000, /* each 3 seconds */
    async queryFn() {
      const res = await fetch(`/api/users/${userId}/notifications/unread-count`)

      return await res.json() as Awaited<UnreadCountVm>
    }
  })
}
