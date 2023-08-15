import { fetchWrapper } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'

export type CreateRoomPayload = {
  topic: string
  language: string
  max_participants: number
}

async function createRoom(roomPayload: CreateRoomPayload): Promise<string> {
  const data = await fetchWrapper('/rooms', {
    method: 'POST',
    body: JSON.stringify(roomPayload),
  })
  return data.message
}

export function useCreateRoom() {
  return useMutation({
    mutationFn: (payload: CreateRoomPayload) => createRoom(payload),
  })
}
