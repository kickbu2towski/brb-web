import { Button } from "@/components/ui/button"
import clsx from "clsx"
import { twMerge } from "tailwind-merge"

type Props = {
  icon: React.ReactNode
  tab: string
  isSelected: boolean
  selectTab: (tab: string) => void
}

export function RoomTabItem(props: Props) {
  const { icon, tab: text, isSelected, selectTab } = props

  return (
    <Button
      variant="outline"
      className={twMerge(
        'rounded-2xl px-4 py-1 w-auto border-none h-auto flex gap-2 items-center text-sm ring-offset-bg-2 hover:bg-bg hover:text-fg',
        clsx(isSelected && 'bg-bg text-fg border border-border')
      )}
      onClick={() => selectTab(text)}
    >
      {icon}
      <p>{text}</p>
    </Button>
  )
}
