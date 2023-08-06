import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DMEvent, PayloadMessage, User, UserIdentity } from '@/shared.types'
import { mutateUnreadCountAtom } from '@/lib/store'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'

type Data = {
  event: DMEvent
}

export function useWSEvent() {
  const queryClient = useQueryClient()
  const [, mutateUnreadCount] = useAtom(mutateUnreadCountAtom)
  const router = useRouter()

  return useMutation({
    mutationFn: (data: Data): Promise<Data> => {
      return Promise.resolve(data)
    },
    onSuccess(data) {
      const { type, payload } = data.event
      switch (type) {
        case 'Create': {
          const { dm_id } = payload
          queryClient.setQueriesData(['messages', dm_id], (data: unknown) => {
            return [...(data as PayloadMessage[]), payload]
          })

          const me = queryClient.getQueryData(['me']) as User

          if (
            payload.user.id !== me.id &&
            router.asPath !== `/dm/${payload.user.id}`
          ) {
            mutateUnreadCount(payload.user.id, false)
            queryClient.setQueriesData(['dms'], (data: unknown) => {
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
        case 'Edit':
        case 'Reaction':
        case 'Delete':
          const { dm_id } = payload
          queryClient.setQueryData(['messages', dm_id], (data: unknown) => {
            return (data as PayloadMessage[]).map((m) => {
              if (m.id === payload.id) {
                return {
                  ...m,
                  ...payload,
                  reactions:
                    type === 'Reaction'
                      ? JSON.parse(payload.reactions)
                      : m.reactions,
                  is_edited: type === 'Edit' ? true : m.is_edited,
                  is_deleted: type === 'Delete' ? true : m.is_deleted,
                }
              }

              return m
            })
          })
          break
      }
    },
  })
}
