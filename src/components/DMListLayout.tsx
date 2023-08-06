import { ReactNode } from 'react'
import { DMList } from '@/components/DMList'

type Props = {
  children: ReactNode
}

export function DMListLayout(props: Props) {
  const { children } = props
  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-[260px_1fr] overflow-auto">
      <DMList className="hidden md:flex" />
      {children}
    </div>
  )
}
