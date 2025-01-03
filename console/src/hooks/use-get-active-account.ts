import { useQuery } from "@tanstack/react-query"
import { useGetActiveAccountId } from "./use-get-active-account-id"
import type { UserAccountVm } from "@/types/header"

export const useGetActiveAccount = (userId: string | null) => {
  const accountId = useGetActiveAccountId()
  const enabled = Boolean(userId) && Boolean(accountId)

  return useQuery({
    queryKey: ['users', userId, 'accounts', accountId],
    enabled,
    async queryFn() {
      const res = await fetch(`/api/users/${userId}/accounts/${accountId}`)
      const data = await res.json() as Awaited<UserAccountVm>

      return data
    }
  })
}
