import { fetchWrapper } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'

async function fetchRoomToken(roomID: string): Promise<string> {
  const data = await fetchWrapper(`/room/${roomID}/token`, {
    method: "POST"
  })
  return data.token
}

export function useRoomToken(roomID: string) {
  return useQuery({
    queryKey: ['room', 'token', roomID],
    queryFn: () => fetchRoomToken(roomID),
    enabled: roomID !== undefined,
    staleTime: 0,
  })
}
