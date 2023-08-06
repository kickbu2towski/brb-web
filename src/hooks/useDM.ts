import { fetchWrapper } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'

async function fetchDM(participants: string[]): Promise<number> {
  const data = await fetchWrapper(`/dms`, {
    method: 'POST',
    body: JSON.stringify({ participants }),
  })
  return data.dm_id
}

export function useDM(participants: string[]) {
  return useQuery({
    queryKey: ['dm', participants],
    queryFn: () => fetchDM(participants),
    enabled: participants[0] !== undefined && participants[1] !== undefined,
  })
}
