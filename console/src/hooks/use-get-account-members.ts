import { useQuery } from '@tanstack/react-query'
import { SelectorAccountMemberVm } from '@/types/account-members-selector'
import { useApiClient } from './use-api-client'

export const useGetAccountMembers = (accountId: string) => {
  const axios = useApiClient()

  return useQuery({
    queryKey: ['accounts', accountId, 'members'],
    async queryFn() {
      const { data } = await axios.get<SelectorAccountMemberVm[]>(`/api/accounts/${accountId}/members`)

      return data
    }
  })
}
