import { fetchWrapper } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'

export type UserResult = {
  id: number
  username: string
  avatar: string
  followers_count: number
  following_count: number
  friends_count: number
  is_following: boolean
  is_friend: boolean
}

async function searchUsers(username: string): Promise<UserResult[]> {
  const data = await fetchWrapper(`/users?username=${username}`)
  return data.users
}

export function useSearchUsers(username: string) {
  return useQuery({
    queryKey: ['searchUsers', username],
    queryFn: () => searchUsers(username),
    enabled: username.length > 0,
  })
}
