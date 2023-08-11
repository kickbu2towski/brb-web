import { ReactNode, useCallback, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import clsx from 'clsx'
import { inter } from '@/lib/fonts'
import { useWSEvent } from '@/hooks'
import { PublisEvent } from '@/shared.types'
import { useAtom } from 'jotai'
import { wsConnAtom } from '@/lib/ws'

type Props = {
  children: ReactNode
}

export function Layout(props: Props) {
  const { mutate } = useWSEvent()
  const { children } = props
  const [wsConn] = useAtom(wsConnAtom)

  const onMessage = useCallback(
    (e: MessageEvent) => {
      try {
        const { data } = JSON.parse(e.data) as { data: PublisEvent }
        if (data.name === 'PublishEvent') {
          mutate({ event: data })
        }
      } catch (err) {
      }
    },
    [mutate]
  )

  useEffect(() => {
    console.log('adding ws listener')
    wsConn?.addEventListener('message', onMessage)
    return () => {
      console.log('removing ws listener')
      wsConn?.removeEventListener('message', onMessage)
    }
  }, [onMessage, wsConn])

  return (
    <div
      className={clsx(
        'h-full grid grid-cols-1 md:grid-cols-[auto_1fr] overflow-auto',
        inter.variable
      )}
    >
      <Sidebar className="hidden md:flex" />
      {children}
    </div>
  )
}
