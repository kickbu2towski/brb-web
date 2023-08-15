import { fetchWrapper } from '@/lib/utils'
import { Room } from '@/shared.types'
import { useQuery } from '@tanstack/react-query'

async function fetchRoom(roomID: string): Promise<Room> {
  const data = await fetchWrapper(`/room/${roomID}`)
  return data.room
}

export function useRoom(roomID: string, enabled: boolean) {
  return useQuery({
    queryKey: ['rooms', roomID],
    queryFn: () => fetchRoom(roomID),
    enabled
  })
}
