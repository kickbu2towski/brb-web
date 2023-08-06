import { UserResult, useFollow } from '@/hooks'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card } from '@/components/ui/card'
import { AvatarWrapper } from '@/components/AvatarWrapper'
import { Unfollow } from '@/components/Unfollow'

type Props = {
  user: UserResult
  username: string
}

export function UserCard(props: Props) {
  const { user, username } = props
  const followUser = useFollow()

  return (
    <Card
      className="py-4 flex flex-col gap-6 text-sidebar-2-fg hover:-translate-y-1 hover:shadow-lg transition duration-200"
      key={user.id}
    >
      <div className="flex items-center justify-center gap-4 flex-col">
        <AvatarWrapper
          className="h-20 w-20"
          src={user.avatar}
          alt={user.username}
        />
        <p className="text-xl">{user.username}</p>
        {user.is_following ? (
          <Unfollow userID={user.id} queryKey={['searchUsers', username]}>
            <Button variant="secondary" size="sm" className="px-8">
              Unfollow
            </Button>
          </Unfollow>
        ) : (
          <Button
            size="sm"
            className="px-8"
            onClick={() => {
              followUser.mutate({ userID: user.id, username })
            }}
          >
            Follow
          </Button>
        )}
      </div>
      <Separator className="hidden sm:block" />
      <div className="flex brand px-4 gap-12 justify-center">
        <div className="flex flex-col gap-1">
          <span className="text-center text-2xl font-bold">
            {user.followers_count}
          </span>
          <span className="text-sidebar-2-muted">Followers</span>
        </div>
        <Separator orientation="vertical" />
        <div className="flex flex-col gap-1">
          <span className="text-center text-2xl font-bold">
            {user.following_count}
          </span>
          <span className="text-sidebar-2-muted">Following</span>
        </div>
      </div>
    </Card>
  )
}
