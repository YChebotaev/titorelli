import { useSuspenseQuery } from "@tanstack/react-query"
import type { UserAccountVm } from "@/types/header"
import { useGetActiveAccountId } from "./use-get-active-account-id"

export const useGetActiveAccount = (userId: string | null) => {
  const accountId = useGetActiveAccountId()
  const enabled = Boolean(userId) && Boolean(accountId)

  return useSuspenseQuery({
    queryKey: ['users', userId, 'accounts', accountId],
    async queryFn() {
      if (enabled) {
        const res = await fetch(`/api/users/${userId}/accounts/${accountId}`)
        const data = await res.json() as Awaited<UserAccountVm>

        return data
      }

      return null
    }
  })
}
