import { useQuery } from "@tanstack/react-query"
import { type UserNotificationVm } from "@/types/user-notification"

export const useGetUserFlashNotifications = (userId: string) => {
  return useQuery({
    queryKey: ['users', userId, 'notifications', 'flash'],
    refetchInterval: 3000, /* each 3 seconds */
    async queryFn() {
      const res = await fetch(`/api/users/${userId}/notifications/flash`)

      return await res.json() as Awaited<UserNotificationVm[]>
    }
  })
}
