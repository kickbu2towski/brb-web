import { fetchWrapper } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'

async function fetchRedirectURL() {
  const data = await fetchWrapper('/auth/redirectURL')
  return data.redirectURL
}

export function useRedirectURL() {
  return useQuery({
    queryKey: ['redirectURL'],
    queryFn: fetchRedirectURL,
    enabled: false,
  })
}
