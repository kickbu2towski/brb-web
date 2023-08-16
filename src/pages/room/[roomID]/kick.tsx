import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Kick() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const roomID =
    typeof router.query.roomID === 'string' ? router.query.roomID : undefined

  useEffect(() => {
    queryClient.setQueryData(['room', roomID, null], () => {
      return { token: null }
    })
  }, [queryClient, roomID])

  return null
}
