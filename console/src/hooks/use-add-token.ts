import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useApiClient } from "./use-api-client"
import type { AccessTokenCreatedRequestDataVm, AccessTokenCreatedResultVm } from "@/types/access-tokens"

export const useAddToken = (accountId: string) => {
  const apiClient = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    async mutationFn(input: AccessTokenCreatedRequestDataVm) {
      const { data } = await apiClient.post<AccessTokenCreatedResultVm>(`/api/accounts/${accountId}/access-tokens`, input)

      return data
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['accounts', accountId, 'access-tokens'] })
    }
  })
}
