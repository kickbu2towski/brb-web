import { useQuery } from '@tanstack/react-query'
import { User } from '@/shared.types'
import { fetchWrapper } from '@/lib/utils'
import { createWSConnAtom } from '@/lib/ws'
import { useAtom } from 'jotai'

async function fetchMe(): Promise<User> {
  const data = await fetchWrapper('/me')
  return data.user
}

export function useMe() {
  const [, createWSConn] = useAtom(createWSConnAtom)
  return useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
    refetchOnMount: false,
    onSuccess() {
      createWSConn()
    },
  })
}
