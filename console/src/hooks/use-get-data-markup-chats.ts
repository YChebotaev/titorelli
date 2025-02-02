import { DMChat, type FolderTypes } from '@/types/data-markup'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useApiClient } from './use-api-client'

export const useGetDataMarkupChats = (folderId: FolderTypes, accountId: string) => {
  const apiClient = useApiClient()
  return useSuspenseQuery({
    queryKey: ['data-markup', 'chats', folderId, accountId],
    async queryFn() {
      if (folderId === 'by-model')
        return []

      const { data } = await apiClient.get<DMChat[]>('/api/data-markup/chats', { params: { accountId } })

      return data
    }
  })
}
