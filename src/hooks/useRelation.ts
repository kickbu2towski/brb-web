import { fetchWrapper } from '@/lib/utils'
import { Relation, UserIdentity } from '@/shared.types'
import { useQuery } from '@tanstack/react-query'

async function fetchRelation(relation: Relation): Promise<UserIdentity[]> {
  const data = await fetchWrapper(`/me/${relation}`)
  return data.users
}

export function useRelation(relation: Relation) {
  return useQuery({
    queryKey: ['relation', relation],
    queryFn: () => fetchRelation(relation),
  })
}
