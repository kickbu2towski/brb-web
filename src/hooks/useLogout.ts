import { fetchWrapper } from '@/lib/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'

async function logout() {
  return fetchWrapper('/auth/logout', { method: 'DELETE' })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}
