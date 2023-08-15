import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PublisEvent, Message, User, UserIdentity, Room } from '@/shared.types'
import { mutateUnreadCountAtom } from '@/lib/store'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'
import { removeParticipant, updateParticipants } from '@/lib/utils'

type Data = {
  event: PublisEvent
}

export function useWSEvent() {
  const queryClient = useQueryClient()
  const [, mutateUnreadCount] = useAtom(mutateUnreadCountAtom)
  const router = useRouter()

  return useMutation({
    mutationFn: (data: Data): Promise<Data> => {
      return new Promise((resolve) => resolve(data))
    },
    onSuccess(data) {
      const { type, payload } = data.event
      switch (type) {
        case 'DM': {
          const { dm_id } = payload
          queryClient.setQueryData(['messages', dm_id], (data: unknown) => {
            let updatedData = [...(data as Message[])]
            const idx = updatedData.findIndex((msg) => msg.id === payload.id)
            if (idx === -1) {
              updatedData = [...updatedData, payload]
            } else {
              updatedData[idx] = payload
            }
            return updatedData
          })

          const me = queryClient.getQueryData(['me']) as User
          if (
            payload.user.id !== me.id &&
            router.asPath !== `/social/dm/${payload.user.id}`
          ) {
            mutateUnreadCount(payload.user.id, false)
            queryClient.setQueryData(['dms'], (data: unknown) => {
              let users = data as UserIdentity[]
              const exist =
                users.findIndex((user) => user.id === payload.user.id) !== -1
              if (!exist) {
                users = [...users, payload.user]
              }
              return users
            })
          }
          break
        }
        case 'RoomStarted': {
          queryClient.setQueryData(['rooms'], (data: unknown) => {
            const updatedRooms = [...(data ?? []) as Room[]]
            updatedRooms.push(payload)
            return updatedRooms
          })
          break
        }
        case 'RoomFinished': {
          queryClient.setQueryData(['rooms'], (data: unknown) => {
            const updatedRooms = [...(data ?? []) as Room[]]
            return updatedRooms.filter(room => room.id !== payload.id)
          })
          break
        }
        case 'ParticipantJoined': {
          queryClient.setQueriesData(['rooms'], (data: unknown) => {
            if(Array.isArray(data)) {
              const updatedRooms = [...(data ?? []) as Room[]]
              const idx = updatedRooms.findIndex(room => room.id === payload.roomID)
              if(idx !== -1) {
                const room = updateParticipants(updatedRooms[idx], payload.participant)
                updatedRooms[idx] = room
              }
              return updatedRooms
            }

            if(data && (data as Room).id === payload.roomID) {
              return updateParticipants((data as Room), payload.participant)
            }

            return data
          })
          break
        }
        case 'ParticipantLeft': {
          queryClient.setQueriesData(['rooms'], (data: unknown) => {
            if(Array.isArray(data)) {
              const updatedRooms = [...(data ?? []) as Room[]]
              const idx = updatedRooms.findIndex(room => room.id === payload.roomID)
              if(idx !== -1) {
                const pID = parseInt(payload.participantID)
                const room = removeParticipant(updatedRooms[idx], pID)
                updatedRooms[idx] = room
              }
              return updatedRooms
            }

            if(data && (data as Room).id === payload.roomID) {
              const pID = parseInt(payload.participantID)
              return removeParticipant((data as Room), pID)
            }

            return data
          })
          break
        }
      }
    },
  })
}
