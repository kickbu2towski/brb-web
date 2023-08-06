import { fetchWrapper } from '@/lib/utils'
import { UserIdentity } from '@/shared.types'
import { useQuery } from '@tanstack/react-query'

async function fetchDMList(): Promise<UserIdentity[]> {
  const data = await fetchWrapper(`/me/dms`)
  return data.users
}

export function useDMList() {
  return useQuery({
    queryKey: ['dms'],
    queryFn: () => fetchDMList(),
  })
}
