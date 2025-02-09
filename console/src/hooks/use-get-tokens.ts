import { useSuspenseQuery } from "@tanstack/react-query"
import { useApiClient } from "./use-api-client"
import { AccessTokenVm } from "@/types/access-tokens"

export const useGetTokens = (accountId: string) => {
  const apiClient = useApiClient()

  return useSuspenseQuery({
    queryKey: ['accounts', accountId, 'access-tokens'],
    async queryFn() {
      const { data } = await apiClient.get<AccessTokenVm[]>(`/api/accounts/${accountId}/access-tokens`)

      return data
    }
  })
}
