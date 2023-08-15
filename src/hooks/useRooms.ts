import { fetchWrapper } from '@/lib/utils'
import { Room } from '@/shared.types'
import { useQuery } from '@tanstack/react-query'

const room = {
  id: '11',
  co_owners: [],
  owner: {
    id: 6,
    username: 'kick buttowski',
    avatar:
      'https://lh3.googleusercontent.com/a/AAcHTtf1B-jyLkDaScMok7MubtcW2ITXjlrPOitbkF7KowGCyw=s96-c',
  },
  topic: 'This is the first room',
  language: 'Hindi',
  welcomeMessage: 'Hi Bitches!',
  participants: [
    {
      id: 6,
      username: 'kick buttowski',
      avatar:
        'https://lh3.googleusercontent.com/a/AAcHTtf1B-jyLkDaScMok7MubtcW2ITXjlrPOitbkF7KowGCyw=s96-c',
    },
    {
      id: 7,
      username: 'Kick Buttowski',
      avatar:
        'https://lh3.googleusercontent.com/a/AAcHTtdOlEcAJZlDcSaYlLFTFoAW8L0uZwAriJB8O8bV_zo9J6I=s96-c',
    },
    {
      id: 3,
      username: 'Kick Buttowski',
      avatar:
        'https://lh3.googleusercontent.com/a/AAcHTteSxwbPSlneg3A7PrXlorZLL3zp7HB3fGqdE6bEj3G-C68=s96-c',
    },
  ],
}

async function fetchRooms(): Promise<Room[]> {
  const data = await fetchWrapper("/rooms")
  return [room, ...data.rooms]
}


export function useRooms() {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: fetchRooms,
  })
}
