import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PublisEvent, Message, User, UserIdentity } from '@/shared.types'
import { mutateUnreadCountAtom } from '@/lib/store'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'

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
      const { name, payload } = data.event
      switch (name) {
        case 'PublishEvent': {
          const { dm_id } = payload
          queryClient.setQueriesData(['messages', dm_id], (data: unknown) => {
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
      }
    },
  })
}
