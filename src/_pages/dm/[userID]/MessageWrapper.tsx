import { useState, useRef } from 'react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from '@/components/ui/context-menu'
import { useMatchMedia } from '@/hooks'
import { Drawer } from 'vaul'
import {
  Message,
  DMEvent,
  PayloadEdit,
  UserIdentity,
} from '@/shared.types'
import { Pencil, Trash, Reply, SmilePlus } from 'lucide-react'
import { MessageItem } from './MessageItem'
import { preventDefault } from '@/lib/utils'
import { EmojiPicker } from '@/components/EmojiPicker'
import { useAtom } from 'jotai'
import { wsConnAtom } from '@/lib/ws'

export type Props = {
  message: Message
  replyToMessage: Message | undefined
  isEditing: boolean
  isReplying: boolean
  setReplyTo: React.Dispatch<React.SetStateAction<string>>
  setEditing: React.Dispatch<React.SetStateAction<string>>
  isHighlighted: boolean
  setHightlight: React.Dispatch<React.SetStateAction<string>>
  sender: UserIdentity
  receiver: UserIdentity
}

export function MessageWrapper(props: Props) {
  const [wsConn] = useAtom(wsConnAtom)
  const { sender, receiver } = props
  const [isTablet] = useMatchMedia(['(max-width: 768px)'])
  const { message, setEditing, setReplyTo } = props
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [emojiOpen, setEmojiOpen] = useState(false)

  function handleDelete(id: string) {
    const event: DMEvent = {
      type: 'Delete',
      user_id: sender.id,
      payload: {
        id,
        dm_id: message.dm_id,
      },
      broadcastTo: [sender.id, receiver.id],
      name: 'DMEvent',
    }
    wsConn?.send(JSON.stringify(event))
  }

  function handleEdit() {
    if (!inputRef.current) {
      return
    }
    const content = inputRef.current.value
    const payload: PayloadEdit = {
      id: message.id,
      content,
      dm_id: message.dm_id,
    }
    inputRef.current.value = ''
    setEditing('')

    const event: DMEvent = {
      user_id: sender.id,
      payload,
      type: 'Edit',
      broadcastTo: [sender.id, receiver.id],
      name: 'DMEvent',
    }

    wsConn?.send(JSON.stringify(event))
  }

  function handleReaction(reaction: string) {
    const reactions = message.reactions ?? {}
    let existing = reactions[reaction] ?? []
    const toRemove = existing.findIndex((id) => id === sender.id) !== -1
    const event: DMEvent = {
      user_id: sender.id,
      payload: {
        id: message.id,
        reaction: reaction,
        dm_id: message.dm_id,
        toRemove,
      },
      name: 'DMEvent',
      type: 'Reaction',
      broadcastTo: [sender.id, receiver.id],
    }
    wsConn?.send(JSON.stringify(event))
  }

  if (isTablet) {
    return (
      <>
        <Drawer.Root open={open} onOpenChange={setOpen}>
          <Drawer.Trigger asChild>
            <div role="button" onClick={() => setOpen(true)}>
              <MessageItem
                {...props}
                handleReaction={handleReaction}
                handleEdit={handleEdit}
                ref={inputRef}
              />
            </div>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-bg/80" />
            <Drawer.Content className="bg-popover text-popover-fg flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0">
              <div className="px-2 py-4 bg-popover rounded-t-[10px] flex-1">
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 bg-bg rounded-full mb-3" />
                <div className="flex flex-col gap-2">
                  <button
                    disabled={message.is_deleted}
                    className="rounded-sm py-1 px-4 flex items-center justify-between hover:bg-brand hover:text-fg transition disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => {
                      setOpen(false)
                      setEmojiOpen(true)
                    }}
                  >
                    <span>Add Reaction</span>
                    <SmilePlus className="h-4 w-4" />
                  </button>
                  <button
                    disabled={
                      message.is_deleted || message.user.id !== sender.id
                    }
                    className="rounded-sm py-1 px-4 flex items-center justify-between hover:bg-brand hover:text-fg transition disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => {
                      setOpen(false)
                      setEditing(message.id)
                    }}
                  >
                    <span>Edit</span>
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    className="rounded-sm py-1 px-4 flex items-center justify-between hover:bg-brand hover:text-fg transition disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => {
                      setOpen(false)
                      setReplyTo(message.id)
                    }}
                  >
                    <span>Reply</span>
                    <Reply className="h-4 w-4" />
                  </button>
                  <button
                    disabled={
                      message.is_deleted || message.user.id !== sender.id
                    }
                    className="rounded-sm py-1 px-4 flex items-center justify-between hover:bg-brand hover:text-fg transition disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => {
                      setOpen(false)
                      handleDelete(message.id)
                    }}
                  >
                    <span>Delete</span>
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
        <Drawer.Root open={emojiOpen} onOpenChange={setEmojiOpen}>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-bg/80" />
            <Drawer.Content className="bg-popover text-popover-fg flex flex-col rounded-t-[10px] mt-24 fixed min-h-[30%] bottom-0 left-0 right-0">
              <div className="py-4 bg-popover rounded-t-[10px] flex-1">
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 bg-bg rounded-full mb-3" />
                <EmojiPicker
                  dynamicWidth
                  onSelect={(emoji) => handleReaction(emoji)}
                />
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </>
    )
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <MessageItem
          {...props}
          handleReaction={handleReaction}
          handleEdit={handleEdit}
          ref={inputRef}
        />
      </ContextMenuTrigger>
      <ContextMenuContent className="px-2 py-4 space-y-1">
        <ContextMenuSub>
          <ContextMenuSubTrigger disabled={message.is_deleted}>
            <span className="mr-5">Add Reaction</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="px-0 py-2">
            <ContextMenuItem
              className="focus:bg-transparent p-0"
              onClick={(e) => {
                if (!(e.target instanceof HTMLElement)) {
                  return
                }
                if (e.target.nodeName === 'EM-EMOJI-PICKER') {
                  const path = e.nativeEvent.composedPath()
                  if (preventDefault(path)) {
                    e.preventDefault()
                  }
                }
              }}
            >
              <EmojiPicker onSelect={(emoji) => handleReaction(emoji)} />
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuItem
          disabled={message.is_deleted || message.user.id !== sender.id}
          className="flex items-center gap-5"
          onClick={() => {
            setEditing(message.id)
          }}
        >
          <span className="flex-1">Edit</span>
          <Pencil className="h-4 w-4" />
        </ContextMenuItem>
        <ContextMenuItem
          disabled={message.is_deleted}
          className="flex items-center gap-5"
          onClick={() => setReplyTo(message.id)}
        >
          <span className="flex-1">Reply</span>
          <Reply className="h-4 w-4" />
        </ContextMenuItem>
        <ContextMenuItem
          disabled={message.is_deleted || message.user.id !== sender.id}
          className="flex items-center gap-5"
          onClick={() => handleDelete(message.id)}
        >
          <span className="flex-1">Delete</span>
          <Trash className="h-4 w-4" />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
