import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { API_URL } from './config'
import { Room, UserIdentity } from '@/shared.types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchWrapper(
  path: string,
  options?: Partial<RequestInit>
) {
  const url = API_URL + path
  const res = await fetch(url, {
    ...options,
    credentials: 'include',
  })

  if (!res.ok) {
    if(res.headers.get('Content-Type') === 'application/json') {
      const { error } = await res.json()
      throw new Error(JSON.stringify(error))
    } else {
      throw new Error("failed to fetch")
    }
  }

  return res.json()
}

export function preventDefault(path: EventTarget[]) {
  if (!path.length) {
    return false
  }
  if (path[0] instanceof HTMLInputElement && path[0].nodeName === 'INPUT') {
    return true
  }
  const elements = path.filter(
    (el) =>
      el instanceof HTMLButtonElement &&
      (el.className === 'flex flex-grow flex-center' ||
        el.className === 'icon delete flex')
  )
  return elements.length !== 0
}

export function updateParticipants(room: Room, participant: UserIdentity) {
  const updatedRoom = { ...room }
  const participants = [...updatedRoom.participants]
  const idx = participants.findIndex(p => p.id === participant.id)
  if(idx === -1) {
    participants.push(participant)
  }
  updatedRoom.participants = participants
  return updatedRoom
}

export function removeParticipant(room: Room, participantID: number) {
  const updatedRoom = { ...room }
  const participants = [...updatedRoom.participants]
  updatedRoom.participants = participants.filter(p => p.id !== participantID)
  return updatedRoom
}
