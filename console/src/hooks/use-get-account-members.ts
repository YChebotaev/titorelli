import { useQuery } from '@tanstack/react-query'
import { SelectorAccountMemberVm } from '@/types/account-members-selector'

export const useGetAccountMembers = (accountId: string) => {
  return useQuery({
    queryKey: ['accounts', accountId, 'members'],
    async queryFn() {
      const resp = await fetch(`/api/accounts/${accountId}/members`)
      const data = await resp.json() as Awaited<SelectorAccountMemberVm[]>

      return data
    }
  })
}
