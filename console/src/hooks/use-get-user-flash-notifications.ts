import { useQuery } from "@tanstack/react-query"
import { type UserNotificationVm } from "@/types/user-notification"
import { useApiClient } from "./use-api-client"

export const useGetUserFlashNotifications = (userId: string) => {
  const axios = useApiClient()

  return useQuery({
    queryKey: ['users', userId, 'notifications', 'flash'],
    refetchInterval: 30000, /* each 30 seconds, debug only */
    async queryFn() {
      const { data } = await axios.get<UserNotificationVm[]>(`/api/users/${userId}/notifications/flash`)

      return data
    }
  })
}
