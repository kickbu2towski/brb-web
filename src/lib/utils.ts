import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { API_URL } from './config'

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
    throw new Error('failed to fetch')
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
