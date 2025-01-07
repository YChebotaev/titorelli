import { useSuspenseQuery } from '@tanstack/react-query'
import type { UserAccountVm } from '@/types/header'

export const useGetUserAccounts = (userId: string) => {
  return useSuspenseQuery({
    queryKey: ['users', userId, 'accounts'],
    async queryFn() {
      const resp = await fetch(`http://localhost:3000/api/users/${userId}/accounts`)
      const data = await resp.json() as Awaited<UserAccountVm[]>

      return data
    }
  })
}
