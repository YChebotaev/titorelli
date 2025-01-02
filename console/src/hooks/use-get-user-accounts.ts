import { useQuery } from '@tanstack/react-query'
import type { UserAccountVm } from '@/types/header'

export const useGetUserAccounts = (userId: string) => {
  return useQuery({
    queryKey: ['users', userId, 'accounts'],
    async queryFn() {
      const resp = await fetch(`/api/users/${userId}/accounts`)
      const data = await resp.json() as Awaited<UserAccountVm[]>

      return data
    }
  })
}
