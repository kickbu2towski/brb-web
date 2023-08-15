import { Dispatch, SetStateAction } from 'react'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
import { tabs } from '@/lib/constants'
import { Button } from '@/components/ui/button'

type TabItemProps = {
  setSelectedTab: Dispatch<SetStateAction<string>>
  selectedTab: string
  tab: string
}

export function TabItem(props: TabItemProps) {
  const { selectedTab, setSelectedTab, tab } = props
  return (
    <Button
      variant="ghost"
      onClick={() => setSelectedTab(tab)}
      className={twMerge(
        'text-muted py-[6px] px-4 h-auto w-auto',
        clsx(
          tab === selectedTab && 'bg-brand/20 text-brand-fg',
          tab === tabs[3] && 'hidden md:block'
        )
      )}
    >
      {tab}
    </Button>
  )
}


        // 'font-medium text-muted rounded-sm hover:text-fg transition duration-300 capitalize',
