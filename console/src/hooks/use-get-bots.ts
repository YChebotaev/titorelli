import type { BotVm } from "@/types/bot";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useApiClient } from "./use-api-client";

export const useGetBots = (accountId: string, { initialData }: { initialData?: BotVm[] }) => {
  const apiClient = useApiClient()

  return useSuspenseQuery({
    queryKey: ['accounts', accountId, 'bots'],
    initialData,
    async queryFn() {
      const { data } = await apiClient.get<BotVm[]>(`/api/accounts/${accountId}/bots`)

      return data
    }
  })
}
