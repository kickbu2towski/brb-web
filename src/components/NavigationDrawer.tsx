import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { DMList } from '@/components/DMList'
import { useAtom } from 'jotai'
import { totalUnreadCountAtom } from '@/lib/store'
import { useRouter } from 'next/router'

export function NavigationDrawer() {
  const [unreadCount] = useAtom(totalUnreadCountAtom)
  const router = useRouter()

  return (
    <Sheet key={router.asPath}>
      <SheetTrigger asChild role="button" className="block md:hidden">
        <div className="relative">
          <Menu />
          {unreadCount ? (
            <span className="h-5 w-5 rounded-full bg-red-500 text-white absolute -top-2 -right-2 flex items-center justify-center text-xs">
              {unreadCount}
            </span>
          ) : null}
        </div>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="grid grid-cols-[80px_260px] p-0 gap-0 w-auto border-none"
      >
        <Sidebar />
        <DMList />
      </SheetContent>
    </Sheet>
  )
}
