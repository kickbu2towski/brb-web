import { Dispatch, SetStateAction } from 'react'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
import { tabs } from '@/lib/constants'

type TabItemProps = {
  setSelectedTab: Dispatch<SetStateAction<string>>
  selectedTab: string
  tab: string
}

export function TabItem(props: TabItemProps) {
  const { selectedTab, setSelectedTab, tab } = props
  return (
    <button
      onClick={() => setSelectedTab(tab)}
      className={twMerge(
        'font-medium text-sidebar-2-muted px-4 py-1 rounded-sm hover:text-fg transition duration-300 capitalize',
        clsx(
          tab === selectedTab && 'bg-sidebar-2-hover/60 text-sidebar-2-fg',
          tab === tabs[3] && 'hidden md:block'
        )
      )}
    >
      {tab}
    </button>
  )
}
