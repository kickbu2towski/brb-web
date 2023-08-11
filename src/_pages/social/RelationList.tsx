import { Fragment } from 'react'
import { useRelation } from '@/hooks'
import { Relation } from '@/shared.types'
import { AvatarWrapper } from '@/components/AvatarWrapper'
import { MoreVertical, Mail, HeartOff, MailOpen } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { Unfollow } from '@/components/Unfollow'

export function RelationList(props: { relation: Relation }) {
  const { relation } = props
  const { isSuccess, data } = useRelation(relation)

  if (!isSuccess) {
    return null
  }

  return (
    <div className="mt-8 flex flex-col gap-5 px-3 md:px-8">
      {data.map((user) => {
        return (
          <Fragment key={user.id}>
            <div className="flex items-center justify-between">
              <div className="flex gap-4 items-center">
                <AvatarWrapper src={user.avatar} alt={user.username} />
                <p>{user.username}</p>
              </div>
              {relation !== 'followers' && (
                <div className="flex items-center gap-3">
                  {relation === 'friends' && (
                    <Link
                      href={`/dm/${user.id}`}
                      className="relative top-[7px] text-muted bg-bg shadow-sm p-2 rounded-full flex items-center justify-center hover:text-fg"
                    >
                      {' '}
                      <MailOpen size={15} />{' '}
                    </Link>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="text-muted h-5 w-5 relative top-2" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      side="left"
                      className="px-3 py-3 space-y-2"
                    >
                      {relation === 'friends' && (
                        <DropdownMenuItem className="px-2 flex items-center gap-3">
                          <Link
                            href={`/dm/${user.id}`}
                            className="flex gap-3 items-center"
                          >
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>Send Message</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                        <Unfollow
                          queryKey={['relation', relation]}
                          userID={user.id}
                        >
                          <button className="flex items-center gap-3">
                            <HeartOff className="h-4 w-4 text-muted-foreground" />
                            <span>Unfollow</span>
                          </button>
                        </Unfollow>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
            <Separator />
          </Fragment>
        )
      })}
    </div>
  )
}
