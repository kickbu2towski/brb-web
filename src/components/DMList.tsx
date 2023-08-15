import { Plus, UserCheck2 } from 'lucide-react'
import { TooltipWrapper } from '@/components/TooltipWrapper'
import Link from 'next/link'
import { useDMList } from '@/hooks'
import { AvatarWrapper } from './AvatarWrapper'
import { useRouter } from 'next/router'
import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'
import { useAtom } from 'jotai'
import { unreadCountAtom } from '@/lib/store'

type Props = {
  className?: string
}

export function DMList(props: Props) {
  const { className = '' } = props
  const { isSuccess, data: users } = useDMList()
  const [unreadCount] = useAtom(unreadCountAtom)
  const router = useRouter()

  return (
    <div
      className={twMerge(
        'text-muted bg-bg rounded-l-lg border-r border-border/60 w-[260px] px-2 py-4 flex flex-col',
        className
      )}
    >
      <Link
        href="/social"
        className={twMerge(
          'flex font-medium items-center gap-3 hover:text-brand-fg hover:bg-brand/20 px-4 py-2 rounded-md mb-6 transition duration-300',
          clsx(
            router.asPath === '/social' &&
              'bg-brand/20 text-brand-fg'
          )
        )}
      >
        <UserCheck2 />
        <span>Friends</span>
      </Link>

      <div>
        <div className="flex items-center justify-between px-3">
          <span className="hover:text-fg transition duration-300 font-medium">
            Direct Messages
          </span>
          <TooltipWrapper text="Create DM">
            <Plus className="hover:text-fg transition duration-300 w-5 h-5 relative top-[2px]" />
          </TooltipWrapper>
        </div>

        {isSuccess && (
          <div className="mt-4 flex flex-col gap-2">
            {users.map((user) => {
              return (
                <Link
                  href={`/social/dm/${user.id}`}
                  className={twMerge(
                    'flex items-center justify-between px-3 rounded-md hover:text-brand-fg transition duration-300 hover:bg-brand/20 py-2',
                    clsx(
                      router.asPath === `/social/dm/${user.id}` &&
                        'bg-brand/20 text-brand-fg'
                    )
                  )}
                  key={user.id}
                >
                  <div className="flex gap-2 items-center">
                    <AvatarWrapper
                      className="h-7 w-7"
                      src={user.avatar}
                      alt={user.username}
                      fallbackClassName="text-[10px]"
                    />
                    <p>{user.username}</p>
                  </div>
                  {unreadCount[user.id] ? (
                    <span className="h-5 w-5 rounded-xl px-3 bg-red-500 text-white flex items-center justify-center text-xs">
                      {unreadCount[user.id]}
                    </span>
                  ) : null}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
