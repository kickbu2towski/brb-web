import { fetchWrapper } from '@/lib/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'

async function unfollow(userID: number) {
  return fetchWrapper(`/users/${userID}/unfollow`, {
    method: 'DELETE',
  })
}

export function useUnfollow() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userID }: { userID: number; queryKey: string[] }) =>
      unfollow(userID),
    onSuccess: (_, { queryKey }) => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
}
