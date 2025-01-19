import { useQuery } from "@tanstack/react-query"
import { type UnreadCountVm } from "@/types/user-notification"
import { useApiClient } from "./use-api-client"

export const useGetUnreadNotificationsCount = (userId: string) => {
  const axios = useApiClient()

  return useQuery({
    queryKey: ['users', userId, 'notifications', 'unread-count'],
    refetchInterval: 3000, /* each 3 seconds */
    async queryFn() {
      const { data } = await axios.get<UnreadCountVm>(`/api/users/${userId}/notifications/unread-count`)

      return data
    }
  })
}
