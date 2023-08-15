import { fetchWrapper } from '@/lib/utils'
import { Kick, Room, UserIdentity } from '@/shared.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type UpdateRoomPayload = {
  roomID: string
  coOwner?: UserIdentity
  welcomeMessage?: string
  kick?: Kick
}

async function updateRoom(payload: UpdateRoomPayload): Promise<Room> {
  const { roomID, ...rest } = payload
  const data = await fetchWrapper(`/room/${roomID}`, {
    method: 'PUT',
    body: JSON.stringify(rest),
  })
  return data.room
}

export function useUpdateRoom() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateRoomPayload) => updateRoom(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["rooms", data.id]})
    }
  })
}
