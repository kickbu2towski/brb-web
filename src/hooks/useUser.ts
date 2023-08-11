import { fetchWrapper } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { UserIdentity } from '@/shared.types'

async function fetchUser(userID: number): Promise<UserIdentity> {
  const data = await fetchWrapper(`/users/${userID}`)
  return data.user
}

export function useUser(userID: number) {
  return useQuery({
    queryKey: ['user', userID],
    queryFn: () => fetchUser(userID),
    enabled: userID !== undefined,
  })
}
