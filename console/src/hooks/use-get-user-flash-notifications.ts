import { useQuery } from "@tanstack/react-query"
import { type UserNotificationVm } from "@/types/user-notification"
import { useApiClient } from "./use-api-client"

export const useGetUserFlashNotifications = (userId: string) => {
  const axios = useApiClient()

  return useQuery({
    queryKey: ['users', userId, 'notifications', 'flash'],
    refetchInterval: 3000, /* each 3 seconds */
    async queryFn() {
      const { data } = await axios.get<UserNotificationVm[]>(`/api/users/${userId}/notifications/flash`)

      return data
    }
  })
}
