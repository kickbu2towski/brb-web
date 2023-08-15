import { forwardRef } from 'react'

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
import { ReactNode } from 'react'

type Props = {
  title: string
  description: string
  children: ReactNode
  onOk: () => void
}

export const AlertDialogWrapper = forwardRef((props: Props, _ref) => {
  const { title, description, children, onOk } = props
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:bg-bg hover:text-fg ring-offset-bg-2">Cancel</AlertDialogCancel>
          <AlertDialogAction className="ring-offset-bg-2" onClick={onOk}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
})

AlertDialogWrapper.displayName = 'AlertDialogWrapper'
