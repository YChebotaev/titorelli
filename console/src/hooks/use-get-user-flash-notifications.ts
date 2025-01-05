import { useQuery } from "@tanstack/react-query"
import { type UserFlashNotificationVm } from "@/types/flash-notifications"

export const useGetUserFlashNotifications = (userId: string) => {
  return useQuery({
    queryKey: ['users', userId, 'flash-notifications'],
    refetchInterval: 3000, /* each 3 seconds */
    async queryFn() {
      const res = await fetch(`/api/users/${userId}/flash-notifications`)

      return await res.json() as Awaited<UserFlashNotificationVm[]>
    }
  })
}
