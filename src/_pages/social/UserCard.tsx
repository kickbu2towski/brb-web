import { UserResult, useFollow } from '@/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AvatarWrapper } from '@/components/AvatarWrapper'
import { Unfollow } from '@/components/Unfollow'
import { MailOpen } from 'lucide-react'
import Link from 'next/link'

type Props = {
  user: UserResult
  username: string
}

export function UserCard(props: Props) {
  const { user, username } = props
  const followUser = useFollow()

  return (
    <Card
      className="py-4 flex flex-col gap-6 text-sidebar-2-fg hover:-translate-y-1 hover:shadow-lg transition duration-200 relative px-4"
      key={user.id}
    >
      <div className="flex justify-center gap-3 flex-col">
        <AvatarWrapper
          className="h-20 w-20"
          src={user.avatar}
          alt={user.username}
        />
        <div className="flex items-center gap-3">
          <p className="text-xl">{user.username}</p>
          {user.is_friend && (
            <Link
              href={`/social/dm/${user.id}`}
              className="text-muted bg-bg-alt p-2 rounded-full flex items-center justify-center hover:text-fg"
            >
              <MailOpen size={16} />
            </Link>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-1 text-sm">
          <p className="font-bold">{user.friends_count || 0}</p>
          <p className="text-muted">Friends</p>
        </div>
        <div className="flex items-center gap-1">
          <p className="font-bold">{user.followers_count}</p>
          <p className="text-muted">Followers</p>
        </div>
        <div className="flex items-center gap-1">
          <p className="font-bold">{user.following_count}</p>
          <p className="text-muted">Following</p>
        </div>
      </div>
      <div className="absolute right-4 top-4 ">
        {user.is_following ? (
          <Unfollow userID={user.id} queryKey={['searchUsers', username]}>
            <Button variant="secondary" size="sm" className="px-4 text-sm">
              Unfollow
            </Button>
          </Unfollow>
        ) : (
          <Button
            size="sm"
            className="px-5 text-sm"
            onClick={() => {
              followUser.mutate({ userID: user.id, username })
            }}
          >
            Follow
          </Button>
        )}
      </div>
    </Card>
  )
}
