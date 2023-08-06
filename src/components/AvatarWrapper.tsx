import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { twMerge } from 'tailwind-merge'

type Props = {
  src: string
  alt: string
  className?: string
  fallbackClassName?: string
}

export function AvatarWrapper(props: Props) {
  const { src, alt, fallbackClassName = '', ...rest } = props
  return (
    <Avatar {...rest}>
      <AvatarImage src={src} alt={alt} referrerPolicy="no-referrer" />
      <AvatarFallback
        className={twMerge('uppercase text-fg', fallbackClassName)}
      >
        {getFallback(alt)}
      </AvatarFallback>
    </Avatar>
  )
}

function getFallback(alt: string) {
  const split = alt.split(' ')

  if (split.length > 1) {
    return split[0][0] + split[1][0]
  }

  return split[0].slice(0, 2)
}
