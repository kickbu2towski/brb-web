import Picker from '@emoji-mart/react'
import { useQueryClient } from '@tanstack/react-query'

type Props = {
  onSelect: (emoji: string) => void
  [key: string]: any
}

export function EmojiPicker(props: Props) {
  const { onSelect, ...rest } = props
  const queryClient = useQueryClient()
  const emojiData = queryClient.getQueryData(['emoji'])
  return (
    <Picker
      data={emojiData}
      theme="dark"
      previewPosition="none"
      skinTonePosition="none"
      onEmojiSelect={(data: any) => {
        onSelect(data.native)
      }}
      {...rest}
    />
  )
}
