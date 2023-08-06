import { Home, User, LogIn } from 'lucide-react'
import Link from 'next/link'
import { TooltipWrapper } from '@/components/TooltipWrapper'
import { useMe, useRedirectURL } from '@/hooks'
import { LoggedInUser } from '@/components/LoggedInUser'
import { AlertDialogWrapper } from '@/components/AlertDialogWrapper'
import { useEmoji } from '@/hooks'
import { init } from 'emoji-mart'
import { twMerge } from 'tailwind-merge'
import { totalUnreadCountAtom } from '@/lib/store'
import { useAtom } from 'jotai'

const links = [
  { icon: Home, text: 'Rooms', href: '/' },
  { icon: User, text: 'Social', href: '/social' },
] as const

type Props = {
  className?: string
}

export function Sidebar(props: Props) {
  const [unreadCount] = useAtom(totalUnreadCountAtom)
  const { className = '' } = props
  const { isSuccess: emojiFetched, data: emojiData } = useEmoji()
  const { data, isSuccess } = useMe()
  const { refetch } = useRedirectURL()

  if (emojiFetched) {
    init({ data: emojiData })
  }

  return (
    <div
      className={twMerge(
        'bg-sidebar px-3 pt-8 pb-4 flex flex-col gap-6',
        className
      )}
    >
      {links.map((link) => {
        const Icon = link.icon
        return (
          <TooltipWrapper text={link.text} key={link.href}>
            <Link
              href={link.href}
              className="h-[48px] w-[48px] rounded-full bg-bg hover:bg-brand hover:text-fg transition flex items-center justify-center relative"
            >
              {}
              <Icon className="w-[22px] h-[22px]" />
              {link.text === 'Social' && unreadCount ? (
                <span className="h-5 w-5 rounded-full bg-red-500 text-white absolute bottom-0 right-0 flex items-center justify-center text-xs">
                  {unreadCount}
                </span>
              ) : null}
            </Link>
          </TooltipWrapper>
        )
      })}

      {isSuccess && data ? (
        <div className="mt-auto hover:border-2 transition duration-300 hover:border-bg rounded-full h-[54px] w-[54px] flex items-center justify-center">
          <LoggedInUser user={data} />
        </div>
      ) : (
        <TooltipWrapper text="Log In">
          <button className="h-[48px] w-[48px] rounded-full flex items-center justify-center mt-auto bg-bg hover:bg-brand rounded-full">
            <AlertDialogWrapper
              title="Login using Google"
              description="Time for a detour to Google. Don't worry, we'll bounce back after login!"
              onOk={async () => {
                const result = await refetch()
                if (typeof result.data === 'string') {
                  window.location.href = result.data
                }
              }}
            >
              <LogIn className="w-[24px] h-[24px]" />
            </AlertDialogWrapper>
          </button>
        </TooltipWrapper>
      )}
    </div>
  )
}
