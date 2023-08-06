import { useQuery } from '@tanstack/react-query'

async function fetchEmoji(): Promise<any> {
  const res = await fetch(`https://cdn.jsdelivr.net/npm/@emoji-mart/data`)
  return res.json()
}

export function useEmoji() {
  return useQuery({
    queryKey: ['emoji'],
    queryFn: () => fetchEmoji(),
    staleTime: Infinity,
  })
}
