import { atom } from 'jotai'
import { WS_URL } from './config'

export const wsConnAtom = atom<WebSocket | null>(null)

export const createWSConnAtom = atom(
  () => '',
  (get, set) => {
    const wsConn = get(wsConnAtom)
    if (!wsConn && typeof WS_URL === 'string') {
      console.log('creating a ws conn')
      atom(wsConnAtom)
      set(wsConnAtom, new WebSocket(WS_URL))
    }
  }
)
