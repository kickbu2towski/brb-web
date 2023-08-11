import { fetchWrapper } from '@/lib/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'

async function followUser(userID: number) {
  return fetchWrapper(`/users/${userID}/follow`, {
    method: 'POST',
  })
}

export function useFollow() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userID }: { userID: number; username: string }) =>
      followUser(userID),
    onSuccess: (_, { username }) => {
      queryClient.invalidateQueries({ queryKey: ['searchUsers', username] })
    },
  })
}
