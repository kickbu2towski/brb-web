import { UnreadCount } from '@/shared.types'
import { atom } from 'jotai'

export const unreadCountAtom = atom<UnreadCount>({})

export const totalUnreadCountAtom = atom((get) =>
  Object.values(get(unreadCountAtom)).reduce((prev, curr) => prev + curr, 0)
)

export const mutateUnreadCountAtom = atom(
  () => '',
  (get, set, userID: number, toRemove: boolean) => {
    set(
      unreadCountAtom,
      mutateUnreadCount(get(unreadCountAtom), userID, toRemove)
    )
  }
)

function mutateUnreadCount(
  unreadCount: UnreadCount,
  userID: number,
  toRemove: boolean
) {
  const update = { ...unreadCount }
  update[userID] = update[userID] ? update[userID] + 1 : 1
  if (toRemove) {
    update[userID] = 0
  }
  return update
}
