import { AvatarWrapper } from '@/components/AvatarWrapper'
import { Input } from '@/components/ui/input'
import clsx from 'clsx'
import { formatRelative } from 'date-fns'
import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { PenLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Props } from './MessageWrapper'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

export const MessageItem = forwardRef<
  HTMLInputElement,
  Props & {
    handleEdit: () => void
    handleReaction: (reaction: string) => void
  }
>((props, ref) => {
  const {
    message,
    isEditing,
    setEditing,
    handleEdit,
    isReplying,
    replyToMessage,
    isHighlighted,
    setHightlight,
    handleReaction,
    sender,
    receiver,
  } = props

  function scrollToMessage(id: string) {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      })
    }
    setHightlight(id)
  }

  return (
    <div
      id={message.id}
      onClick={(e) => {
        if (isEditing) {
          e.stopPropagation()
        }
      }}
      className={twMerge(
        'flex items-start px-4 py-3 gap-4 overflow-x-hidden',
        clsx(
          isEditing && 'bg-bg-2/50 pb-0',
          (isReplying || isHighlighted) && 'bg-brand/10',
          replyToMessage?.id && 'items-center'
        )
      )}
    >
      <AvatarWrapper
        src={message.user.avatar}
        alt={message.user.username}
        className="h-8 w-8"
        fallbackClassName="text-xs"
      />
      <div className="flex flex-col gap-1 flex-1 items-start">
        {replyToMessage?.id && (
          <div className="flex gap-2 items-center">
            <AvatarWrapper
              className="h-4 w-4"
              src={replyToMessage.user.avatar}
              alt={replyToMessage.user.username}
            />
            <button
              onClick={(e) => {
                e.stopPropagation()
                scrollToMessage(replyToMessage.id)
              }}
              className="text-muted hover:text-fg truncate link"
            >
              {replyToMessage.content}
            </button>
          </div>
        )}
        <div className="flex gap-3 items-baseline">
          <p className="font-medium text-muted">{message.user.username}</p>
          <p className="text-muted text-xs capitalize flex items-center gap-1">
            {message.is_edited && (
              <span>
                <PenLine className="h-3 w-3 relative top-[1px]" />
              </span>
            )}
            <span>
              {formatRelative(new Date(message.created_at), new Date())}
            </span>
          </p>
        </div>
        {isEditing ? (
          <div className="w-full">
            <Input
              ref={ref}
              defaultValue={message.content}
              className="w-full"
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleEdit()
                }
              }}
            />
            <p className="text-sm text-muted py-2">
              escape to{' '}
              <Button
                onClick={() => setEditing('')}
                className="p-0 w-auto h-auto hx"
                variant="link"
              >
                cancel
              </Button>{' '}
              • enter to{' '}
              <Button className="p-0 w-auto h-auto" variant="link" onClick={handleEdit}>
                save
              </Button>
            </p>
          </div>
        ) : (
          <>
            {message.is_deleted ? (
              <p className="text-muted italic">This message is deleted</p>
            ) : (
              <div>
                <p className="[overflow-wrap:anywhere]">{message.content}</p>
                {message.reactions ? (
                  <div className="mt-1 flex flex-wrap gap-3 items-center mt-2">
                    {Object.entries(message.reactions).map(
                      ([reaction, userIDs]) => {
                        return (
                          <HoverCard key={reaction}>
                            <HoverCardTrigger asChild>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleReaction(reaction)
                                }}
                                className="py-[1px] px-2 rounded-lg border border-brand bg-brand/10 flex items-center justify-center disabled:pointer-events-none disabled:opacity-50 gap-x-1"
                              >
                                <span>{reaction}</span>
                                <span>{userIDs.length}</span>
                              </button>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-auto flex flex-col gap-4">
                              {userIDs.map((id) => {
                                const user =
                                  id === sender.id ? sender : receiver
                                return (
                                  <div
                                    key={id}
                                    className="flex items-center gap-2"
                                  >
                                    <AvatarWrapper
                                      className="h-4 w-4"
                                      src={user.avatar}
                                      alt={user.username}
                                    />
                                    <p className="text-xs">{user.username}</p>
                                  </div>
                                )
                              })}
                            </HoverCardContent>
                          </HoverCard>
                        )
                      }
                    )}
                  </div>
                ) : null}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
})

MessageItem.displayName = 'MessageItem'
