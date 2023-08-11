import { useDM, useUser, useMessages } from '@/hooks'
import { useRouter } from 'next/router'
import { NextPageWithLayout } from '../../_app'
import { DMListLayout } from '@/components/DMListLayout'
import { useEffect, useState, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { DMEvent, User } from '@/shared.types'
import { AvatarWrapper } from '@/components/AvatarWrapper'
import { Message } from '@/shared.types'
import { MessageWrapper } from '@/_pages/dm/[userID]'
import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'
import { XCircle, SmilePlus } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { EmojiPicker } from '@/components/EmojiPicker'
import { NavigationDrawer } from '@/components/NavigationDrawer'
import { useAtom } from 'jotai'
import { mutateUnreadCountAtom } from '@/lib/store'
import { wsConnAtom } from '@/lib/ws'

const DM: NextPageWithLayout = () => {
  const [wsConn] = useAtom(wsConnAtom)
  const queryClient = useQueryClient()
  const router = useRouter()
  const userID = typeof router.query.userID === "string" ? parseInt(router.query.userID) : undefined
  const [, mutateUnreadCount] = useAtom(mutateUnreadCountAtom)
  const { isSuccess, data: receiver } = useUser(userID as number)
  const me = queryClient.getQueryData(['me']) as User
  const { data: dmID } = useDM([me?.id, receiver?.id as number])
  const { data: messages } = useMessages(dmID as number)

  const inputRef = useRef<HTMLInputElement>(null)
  const messagesRef = useRef<HTMLDivElement>(null)
  const [editing, setEditing] = useState('')
  const [highlight, setHighlight] = useState('')
  const [emojiOpen, setEmojiOpen] = useState(false)

  const [replyTo, setReplyTo] = useState('')
  const replyToUsername = replyTo
    ? messages?.find((message) => message.id === replyTo)?.user.username
    : ''

  useEffect(() => {
    if (messagesRef.current) {
      const element = messagesRef.current
      element.scrollTop = element.scrollHeight
    }
  }, [messages?.length])

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    if (highlight) {
      timeout = setTimeout(() => {
        setHighlight('')
      }, 2000)
    }
    return () => clearTimeout(timeout)
  }, [highlight])

  useEffect(() => {
    if (typeof userID === "number") {
      mutateUnreadCount(userID, true)
    }
  }, [userID, mutateUnreadCount])

  if (!isSuccess || messages === undefined) {
    return null
  }

  return (
    <div className="h-full grid grid-cols-1 grid-rows-[auto_1fr] overflow-auto">
      <div className="p-4 shadow-md">
        <div className="flex gap-4 items-center">
          <NavigationDrawer />
          <AvatarWrapper
            fallbackClassName="text-xs"
            src={receiver.avatar}
            alt={receiver.username}
            className="h-8 w-8 hidden md:block"
          />
          <p>{receiver.username}</p>
        </div>
      </div>

      <div className="grid grid-cols grid-rows-[1fr_auto] overflow-auto pt-2">
        <div className="flex flex-col overflow-auto" ref={messagesRef}>
          {messages.map((message) => {
            const replyToMessage = messages.find(
              (m) => m.id === message.reply_to_id
            )

            return (
              <MessageWrapper
                sender={me}
                receiver={receiver}
                key={message.id}
                isReplying={replyTo === message.id}
                setReplyTo={setReplyTo}
                isEditing={message.id === editing}
                setEditing={setEditing}
                isHighlighted={message.id === highlight}
                setHightlight={setHighlight}
                message={message}
                replyToMessage={replyToMessage}
              />
            )
          })}
        </div>

        <div className="p-4">
          {replyTo && (
            <div className="bg-bg-alt rounded-t-md p-2 flex items-center justify-between">
              <p className="text-sm text-muted">
                Replying to{' '}
                <span className="text-brand font-medium">
                  {replyToUsername}
                </span>
              </p>
              <button onClick={() => setReplyTo('')}>
                <XCircle className="h-4 w-4" />
              </button>
            </div>
          )}
          <div
            className={twMerge(
              'flex bg-input rounded-md shadow-sm',
              clsx(Boolean(replyTo.length) && 'rounded-t-none')
            )}
          >
            <Input
              className="py-6 flex-1 bg-transparent"
              placeholder="Hey there!"
              ref={inputRef}
              onKeyUp={(e) => {
                if (
                  e.key === 'Enter' &&
                  inputRef.current &&
                  inputRef.current.value.trim().length &&
                  dmID !== undefined
                ) {
                  e.preventDefault()
                  const date = new Date()

                  const payload: Message = {
                    dm_id: dmID,
                    id: crypto.randomUUID(),
                    user: {
                      id: me.id,
                      avatar: me.avatar,
                      username: me.username,
                    },
                    content: e.currentTarget.value.trim(),
                    created_at: date.toISOString(),
                  }

                  if (replyTo) {
                    payload.reply_to_id = replyTo
                  }

                  inputRef.current.value = ''
                  setReplyTo('')

                  const event: DMEvent = {
                    user_id: me.id,
                    payload,
                    type: 'Create',
                    broadcastTo: [me.id, receiver.id],
                    name: 'DMEvent',
                  }

                  wsConn?.send(JSON.stringify(event))
                }
              }}
            />
            <Popover onOpenChange={setEmojiOpen} open={emojiOpen}>
              <PopoverTrigger className="text-muted pr-3">
                <SmilePlus />
              </PopoverTrigger>
              <PopoverContent className="px-0 py-2" align="end" side="top">
                <EmojiPicker
                  dynamicWidth
                  onSelect={(emoji) => {
                    if (inputRef.current) {
                      inputRef.current.value += `${emoji}`
                    }
                    setEmojiOpen(false)
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  )
}

DM.getLayout = (page) => <DMListLayout>{page}</DMListLayout>

export default DM
