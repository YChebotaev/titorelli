import { useSuspenseQuery } from '@tanstack/react-query'
import type { UserAccountVm } from '@/types/header'
import { useApiClient } from './use-api-client'

export const useGetUserAccounts = (userId: string) => {
  const axios = useApiClient()

  return useSuspenseQuery({
    queryKey: ['users', userId, 'accounts'],
    async queryFn() {
      const { data } = await axios.get<UserAccountVm[]>(`/api/users/${userId}/accounts`)

      return data
    }
  })
}
