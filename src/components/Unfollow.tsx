import { ReactNode } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useUnfollow } from '@/hooks'

type Props = {
  children: ReactNode
  userID: number
  queryKey: string[]
}

export function Unfollow(props: Props) {
  const { children, userID, queryKey } = props
  const unfollowUser = useUnfollow()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unfollow</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to unfollow this person?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:bg-bg hover:text-fg ring-offset-bg-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="ring-offset-bg-2"
            onClick={() => {
              unfollowUser.mutate({ userID, queryKey })
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
