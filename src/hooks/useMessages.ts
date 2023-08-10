import { fetchWrapper } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { Message as Message } from '@/shared.types'

async function fetchMessages(dmID: number): Promise<Message[]> {
  const data = await fetchWrapper(`/messages?dm_id=${dmID}`)
  return data.messages
}

export function useMessages(dmID: number) {
  return useQuery({
    queryKey: ['messages', dmID],
    queryFn: () => fetchMessages(dmID),
    enabled: dmID !== undefined,
  })
}
