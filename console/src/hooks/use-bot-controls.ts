import { useMutation, useQueryClient } from "@tanstack/react-query"
import { BotCreateRequestDataVm, BotState, BotStateChangeResultVm } from '@/types/bot'
import { useApiClient } from "./use-api-client"

export const useBotControls = (accountId: string) => {
  const apiClient = useApiClient()
  const queryClient = useQueryClient()

  const { mutate: createMutation } = useMutation({
    async mutationFn(params: BotCreateRequestDataVm) {
      const { data } = await apiClient.post<{ ok: boolean }>(`/api/accounts/${accountId}/bots`, params)

      return data
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['accounts', accountId, 'bots'] })
    }
  })

  const { mutate: stateMutation } = useMutation({
    async mutationFn({ id, state }: { id: string, state: BotState }) {
      const { data } = await apiClient.post<BotStateChangeResultVm>(`/api/accounts/${accountId}/bots/${id}/state`, { state })

      return data
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['accounts', accountId, 'bots'] })
    }
  })

  return {
    createMutation,
    stateMutation
  }
}
