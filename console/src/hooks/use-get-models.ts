import type { ModelVM } from "@/types/model";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useApiClient } from "./use-api-client";

export const useGetModels = (accountId: string, { initialData }: { initialData?: ModelVM[] }) => {
  const apiClient = useApiClient()

  return useSuspenseQuery({
    queryKey: ['accounts', accountId, 'models'],
    initialData,
    async queryFn() {
      const { data } = await apiClient.get<ModelVM[]>(`/api/accounts/${accountId}/models`)

      return data
    }
  })
}
