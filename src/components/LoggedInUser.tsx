import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User } from '@/shared.types'
import { LogOut, UserCog } from 'lucide-react'
import { AlertDialogWrapper } from './AlertDialogWrapper'
import { useLogout } from '@/hooks'
import { AvatarWrapper } from './AvatarWrapper'

type Props = {
  user: User
}

export function LoggedInUser(props: Props) {
  const { user } = props
  const logout = useLogout()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className='link'>
          <AvatarWrapper alt={user.username} src={user.avatar} />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="mb-12 px-3 py-4 space-y-2">
          <DropdownMenuItem className="px-2">
            <UserCog className="h-4 w-4 mr-3" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => e.preventDefault()}>
            <AlertDialogWrapper
              title="Log Out"
              description="We are sorry to see you go!"
              onOk={() => {
                logout.mutate()
              }}
            >
              <button className="flex items-center gap-3">
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </button>
            </AlertDialogWrapper>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
