import { AvatarWrapper } from '@/components/AvatarWrapper'
import { Input } from '@/components/ui/input'
import { useMe, useRoom, useRoomToken, useUpdateRoom } from '@/hooks'
import { LIVEKIT_URL } from '@/lib/config'
import { DataPacket_Kind, Room as LKRoom, RoomEvent } from 'livekit-client'
import {
  MicOff,
  VideoOff,
  PhoneOff,
  Mail,
  Settings,
  Crown,
  Trash,
  XCircle,
  Skull,
} from 'lucide-react'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Room,
  RoomMessageOrLogPayload,
  UserIdentity,
  RoomParticipant,
  RoomPublishEvent,
} from '@/shared.types'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { format } from 'date-fns'
import { useQueryClient } from '@tanstack/react-query'
import { RoomTabItem } from '@/_pages/room/[userID]'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
import { statuses } from '@/lib/constants'
import { Separator } from '@/components/ui/separator'
import { KickParticipant, UpdateWelcomeMessage } from '@/_pages/home'
import { useToast } from '@/components/ui/use-toast'
import { Dialog, DialogContent } from '@/components/ui/dialog'

const encoder = new TextEncoder()
const decoder = new TextDecoder()

const roomTabs = [
  {
    icon: <Mail size={15} />,
    tab: 'Messages',
  },
  {
    icon: <Settings size={15} />,
    tab: 'Settings',
  },
]

export default function Room() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { data: me, isSuccess: isMeSuccess } = useMe()
  const roomID =
    typeof router.query.roomID === 'string' ? router.query.roomID : undefined ?? ""
  const {
    data: token,
    isSuccess: isTokenSuccess,
    error: tokenError,
  } = useRoomToken(
    roomID as string,
    Boolean(me?.id) && typeof roomID === 'string'
  )
  const { data: room, isSuccess: isRoomSucces } = useRoom(
    roomID as string,
    isMeSuccess && Boolean(roomID)
  )
  const roomRef = useRef<LKRoom>()
  const inputRef = useRef<HTMLInputElement>(null)
  const [messages, setMessages] = useState<RoomMessageOrLogPayload[]>([])
  const { mutate: updateRoomMutate } = useUpdateRoom()
  const [selectedTab, setSelectedTab] = useState('Messages')
  const [isPM, setIsPM] = useState<RoomParticipant | null>(null)
  const { toast } = useToast()
  const status = room?.participants.find((p) => p.id === me?.id)?.status ?? ''
  const isMeOwner = me?.id === room?.owner.id
  const isMeCoOwner = room?.co_owners.findIndex((co) => co.id === me?.id) !== -1
  const [open, setOpen] = useState(0)

  function publishData(event: RoomPublishEvent) {
    if (roomRef.current) {
      const encData = encoder.encode(JSON.stringify(event))
      let destination: string[] = []
      if (isPM && isPM.sid) {
        destination = [isPM.sid]
      }
      roomRef.current.localParticipant.publishData(
        encData,
        DataPacket_Kind.RELIABLE,
        { destination }
      )
    }
  }

  function setOrUnsetCoOwner(roomID: string, coIdx: number, p: UserIdentity, owner: UserIdentity) {
    updateRoomMutate(
      { roomID, coOwner: p },
      {
        onSuccess() {
          const message: RoomPublishEvent = {
            type: 'MessageOrLog',
            payload: {
              kind: coIdx === -1 ? 'SetCoOwner' : 'UnsetCoOwner',
              payload: {
                owner,
                co_owner: p,
              },
            },
          }
          setMessages((prev) => [...prev, message.payload])
          publishData(message)
        },
      }
    )
  }

  function clearChat(clearer: UserIdentity, cleared: UserIdentity) {
    const message: RoomPublishEvent = {
      type: 'MessageOrLog',
      payload: {
        kind: 'ClearChat',
        payload: {
          clearer,
          cleared,
        },
      },
    }
    setMessages((prev) => [...prev, message.payload])
    clearMessagesForParticipant(cleared.id)
    publishData(message)
  }

  function clearMessagesForParticipant(participantID: number) {
    setMessages((prev) =>
      prev.map((msg) => {
        if (
          msg.kind === 'Message' &&
          msg.payload.user.id === participantID &&
          !msg.payload.pm
        ) {
          return { ...msg, payload: { ...msg.payload, is_deleted: true } }
        }
        return msg
      })
    )
  }

  const updateParticipantStatus = useCallback((participantID: number, status: string) =>{
    queryClient.setQueryData(['rooms', roomID], (data: unknown) => {
      const updatedRoom = { ...(data as Room) }
      updatedRoom.participants = updatedRoom.participants.map((p) =>
        p.id === participantID ? { ...p, status } : p
      )
      return updatedRoom
    })
  }, [roomID, queryClient])

  useEffect(() => {
    if (isMeSuccess && isTokenSuccess && isRoomSucces && LIVEKIT_URL) {
      roomRef.current = new LKRoom()
      roomRef.current
        .connect(LIVEKIT_URL, token)
        .then(() => {
          if (roomRef.current) {
            setMessages((prev) => {
              const isExists =
                prev.findIndex(
                  (m) =>
                    m.kind === 'Topic' &&
                    roomRef.current &&
                    m.payload.content === roomRef.current.name
                ) !== -1
              if (isExists) {
                return prev
              }
              return [
                ...prev,
                {
                  kind: 'Topic',
                  payload: { content: roomRef.current?.name || '' },
                },
              ]
            })
            roomRef.current.on(RoomEvent.DataReceived, (payload) => {
              const data = decoder.decode(payload)
              try {
                let event: RoomPublishEvent = JSON.parse(data)
                if (event.type === 'MessageOrLog') {
                  const { payload: message } = event

                  if (
                    message.kind === 'Kick' &&
                    me.id === message.payload.kicked
                  ) {
                    router.push(`/room/${roomID}/kick`)
                    return
                  }

                  if (message.kind === 'SetCoOwner') {
                    const payload = message.payload
                    queryClient.setQueryData(
                      ['rooms', roomID],
                      (data: unknown) => {
                        const updatedRoom = { ...(data as Room) }
                        updatedRoom.co_owners = [
                          ...updatedRoom.co_owners,
                          payload.co_owner,
                        ]
                        return updatedRoom
                      }
                    )
                  }
                  if (message.kind === 'UnsetCoOwner') {
                    const payload = message.payload
                    queryClient.setQueryData(
                      ['rooms', roomID],
                      (data: unknown) => {
                        const updatedRoom = { ...(data as Room) }
                        updatedRoom.co_owners = updatedRoom.co_owners.filter(
                          (co) => co.id !== payload.co_owner.id
                        )
                        return updatedRoom
                      }
                    )
                  }
                  if (message.kind === 'ClearChat') {
                    const payload = message.payload
                    clearMessagesForParticipant(payload.cleared.id)
                  }
                  if (message.kind === 'WelcomeMessage') {
                    const payload = message.payload
                    queryClient.setQueryData(
                      ['rooms', roomID],
                      (data: unknown) => {
                        const updatedRoom = { ...(data as Room) }
                        updatedRoom.welcome_message = payload.content
                        return updatedRoom
                      }
                    )
                  }
                  setMessages((prev) => [...prev, message])
                } else if (event.type === 'Status') {
                  const payload = event.payload
                  updateParticipantStatus(payload.participantID, payload.status)
                }
              } catch (err) {
                console.error('error: DataReceived:', err)
              }
            })
          }
        })
        .catch((err) => {
          console.error('failed to connect to room:', err)
        })
    }
  }, [token, isMeSuccess, isRoomSucces, isTokenSuccess, router, queryClient, roomID, me?.id, updateParticipantStatus])

  useEffect(() => {
    return () => {
      if (roomRef.current && roomRef.current.name) {
        roomRef.current.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    const element = document.getElementById('roomMessages')
    if (element) {
      element.scrollTop = element.scrollHeight
    }
  }, [messages?.length])

  if (tokenError && tokenError instanceof Error) {
    return (
      <div className="h-full grid place-content-center">
        <div className="text-center">
          <p className="text-2xl mb-1">Kicked Out</p>
          <p className="max-w-sm mx-auto text-muted">
            It seems you have been kicked out by either one of the owner or
            co-owner 👋
          </p>
        </div>
      </div>
    )
  }

  if(!isMeSuccess || !isRoomSucces || !isTokenSuccess) {
    return null
  }

  return (
    <div className="h-full grid grid-cols-[1fr_370px]">
      <div
        className="py-4 grid grid-auto-rows grid-rows-[auto_1fr_auto]"
        style={{ backgroundImage: `url('/pattern.svg')` }}
      >
        <div className="flex gap-5 bg-bg-2 justify-evenly items-center text-popover-fg rounded-full mx-auto shadow-md p-4 px-6 text-muted">
          <MicOff className="hover:text-fg" size={16} />
          <VideoOff className="hover:text-fg" size={16} />
          <PhoneOff className="hover:text-fg" size={16} />
        </div>

        {isRoomSucces && me && (
          <div
            className={twMerge(
              'bg-bg-2/50 my-6 shadow-depth-2 rounded-lg w-[98%] mx-auto flex items-center justify-center relative',
              clsx(!Boolean(room.welcome_message.length) && 'invisible')
            )}
          >
            <p className="text-md text-yellow-500 font-semibold max-w-2xl mx-auto">
              {room.welcome_message.replaceAll('[username]', `@${me.username}`)}
            </p>

            <div
              className="absolute top-0 left-[50%] -translate-x-[50%] p-4 py-1 text-xs rounded-b-xl font-medium"
              style={{ backgroundImage: 'var(--gradient)' }}
            >
              <p>Welcome Message</p>
            </div>
          </div>
        )}

        <div className="flex gap-x-4 px-4 justify-center">
          {room.participants.map((p) => {
            const isMe = p.id === me.id
            const isOwner = p.id === room.owner.id
            const coIdx = room.co_owners.findIndex((co) => co.id === p.id)
            const isCoOwner = coIdx !== -1
            return (
              <div
                key={p.id}
                style={{ backgroundImage: `url(${p.avatar})` }}
                className="h-24 w-24 rounded-sm relative link"
              >
                {(isOwner || isCoOwner || p.status) && (
                  <div
                    className="rounded-tr-xl font-semibold p-1 inline-block px-3 text-[10px] text-brand-fg absolute left-0 bottom-0"
                    style={{
                      backgroundImage: 'var(--gradient)',
                      opacity: 0.9,
                    }}
                  >
                    {p.status ? <p>{p.status}</p> : null}
                    {(isOwner || isCoOwner) && p.status && (
                      <Separator className="my-[2px]" />
                    )}
                    {p.id === room.owner.id && <p>Owner</p>}
                    {coIdx !== -1 && <p>Co-Owner</p>}
                  </div>
                )}
                {!isMe && (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="absolute right-0 top-0 p-1 rounded-bl-lg bg-brand/70 link"
                      role="button"
                    >
                      <Settings size={12} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      onCloseAutoFocus={(e) => {
                        e.preventDefault()
                        if (inputRef.current && isPM) {
                          inputRef.current.focus()
                        }
                      }}
                      side="top"
                      className="mb-1 px-3 py-4 space-y-2 shadow-depth-4 border border-border"
                    >
                      {isMeOwner && (
                        <DropdownMenuItem
                          className="px-2"
                          onClick={() => {
                            const { sid, status, ...rest } = p
                            setOrUnsetCoOwner(roomID, coIdx, rest, me)
                          }}
                        >
                          <Crown className="h-4 w-4 mr-3" />
                          <span>{isCoOwner ? 'Unset' : 'Set'} Co-Owner</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => {
                          if (inputRef.current) {
                            setIsPM(p)
                          }
                        }}
                      >
                        <Mail className="h-4 w-4 mr-3" />
                        <span>PM</span>
                      </DropdownMenuItem>
                      {(isMeOwner || isMeCoOwner) && !isOwner ? (
                        <>
                          <DropdownMenuItem onClick={() => clearChat(me, p)}>
                            <Trash className="h-4 w-4 mr-3" />
                            <span>Clear Chat</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setOpen(p.id)}>
                            <Skull className="h-4 w-4 mr-3" />
                            <span>Kick</span>
                          </DropdownMenuItem>
                        </>
                      ) : null}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            )
          })}
        </div>
        <div></div>
      </div>

      <div className="border-l border-border/80 h-full shadow-depth-2 grid grid-rows-[auto_1fr] overflow-auto">
        <div className="py-2 px-2 flex gap-5 items-center text-muted border-b border-border">
          <div className="flex gap-2 items-center bg-bg-2 w-full px-4 py-2 rounded-2xl justify-between">
            {roomTabs.map((t) => {
              return (
                <RoomTabItem
                  key={t.tab}
                  tab={t.tab}
                  icon={t.icon}
                  selectTab={setSelectedTab}
                  isSelected={selectedTab === t.tab}
                />
              )
            })}
          </div>
        </div>

        {selectedTab === 'Messages' && (
          <div className="grid grid-rows-[1fr_auto] overflow-auto">
            <div
              id="roomMessages"
              className={twMerge(
                'flex flex-col overflow-auto py-4 gap-3',
                clsx(isPM && 'pb-[60px]')
              )}
            >
              {messages.map((m, i) => {
                if (
                  (m.kind === 'Topic' || m.kind === 'WelcomeMessage') &&
                  Boolean(m.payload.content.length)
                ) {
                  return (
                    <div
                      key={i}
                      className="w-[90%] my-2 mx-auto bg-bg-2 flex flex-col gap-2 px-4 py-2 rounded-sm text-sm relative"
                    >
                      <p className="text-muted">
                        {m.kind === 'Topic' ? 'Topic' : 'Welcome Message'}
                      </p>
                      <p>{m.payload.content}</p>

                      {m.payload.user && (
                        <div>
                          <AvatarWrapper
                            className="h-5 w-5 absolute top-2 right-2 rounded-sm"
                            src={m.payload.user.avatar}
                            alt={m.payload.user.username}
                          />
                        </div>
                      )}
                    </div>
                  )
                }

                if (m.kind === 'Message') {
                  const { payload: message } = m
                  return (
                    <div
                      key={i}
                      className={twMerge(
                        'flex px-4 gap-2 items-start py-2',
                        clsx(message.pm && 'bg-red-800/10')
                      )}
                    >
                      <AvatarWrapper
                        className="h-8 w-8 rounded-sm"
                        fallbackClassName="text-[12px]"
                        src={message.user.avatar}
                        alt={message.user.username}
                      />
                      <div className="w-full">
                        <div
                          className={twMerge(
                            'text-muted mb-0 text-sm flex items-center justify-between',
                            clsx(message.pm && 'text-red-100/50')
                          )}
                        >
                          {message.pm && me.id === message.user.id ? (
                            <div className="flex items-center gap-2 mb-[2px]">
                              <AvatarWrapper
                                className="h-5 w-5 rounded"
                                src={message.pm.avatar}
                                alt={message.pm.username}
                              />
                              <p>{message.pm.username}</p>
                            </div>
                          ) : (
                            <p>{message.user.username}</p>
                          )}
                          <p className="text-xs">
                            {format(new Date(message.created_at), 'p')}
                          </p>
                        </div>
                        <p
                          className={twMerge(
                            clsx(message.is_deleted && 'text-muted italic')
                          )}
                        >
                          {message.is_deleted
                            ? 'This message is deleted'
                            : message.content}
                        </p>
                      </div>
                    </div>
                  )
                }

                if (m.kind === 'SetCoOwner') {
                  return (
                    <div key={i} className="text-xs px-4 my-1">
                      <p className="text-yellow-500 font-medium">
                        {m.payload.owner.username} has set{' '}
                        {m.payload.co_owner.username} to Co-Owner
                      </p>
                    </div>
                  )
                }

                if (m.kind === 'UnsetCoOwner') {
                  return (
                    <div key={i} className="text-xs my-1 px-4">
                      <p className="text-red-500 font-medium">
                        {m.payload.owner.username} has unset{' '}
                        {m.payload.co_owner.username} of Co-Owner
                      </p>
                    </div>
                  )
                }

                if (m.kind === 'Kick') {
                  const kicked = room?.participants.find(
                    (p) => p.id === m.payload.kicked
                  )
                  const kickedBy = room?.participants.find(
                    (p) => p.id === m.payload.kicked_by
                  )

                  if (!kicked || !kickedBy) {
                    return null
                  }

                  return (
                    <div key={i} className="text-xs my-1 px-4">
                      <p className="text-red-500 font-medium">
                        {kicked.username} got kicked by {kickedBy.username}
                      </p>
                    </div>
                  )
                }

                if (m.kind === 'ClearChat') {
                  return (
                    <div key={i} className="text-xs my-1 px-4">
                      <p className="text-red-500 font-medium">
                        {m.payload.clearer.username} has deleted{' '}
                        {m.payload.cleared.username} messages
                      </p>
                    </div>
                  )
                }
                return null
              })}
            </div>
            <div className="p-4 border-t border-border relative">
              {isPM && (
                <div className="flex items-center gap-3 bg-bg-2 px-4 py-2 absolute left-0 top-0 w-full -translate-y-full">
                  <AvatarWrapper
                    className="w-7 h-7 rounded-sm"
                    src={isPM.avatar}
                    alt={isPM.username}
                  />
                  <div className="text-sm flex flex-col gap-1">
                    <p className="text-red-500">Send private message</p>
                    <span className="text-fg text-xs text-muted">
                      @{isPM.username}
                    </span>
                  </div>
                  <button
                    className="ml-auto align-center"
                    onClick={() => setIsPM(null)}
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
              )}
              <Input
                ref={inputRef}
                className="border border-border/80 without-ring"
                onKeyUp={(e) => {
                  if (
                    e.key === 'Enter' &&
                    inputRef.current &&
                    inputRef.current.value.trim().length &&
                    roomRef.current
                  ) {
                    e.preventDefault()
                    const date = new Date()
                    const message: RoomPublishEvent = {
                      type: 'MessageOrLog',
                      payload: {
                        kind: 'Message',
                        payload: {
                          id: crypto.randomUUID(),
                          content: e.currentTarget.value.trim(),
                          created_at: date.toISOString(),
                          pm: isPM ?? undefined,
                          user: {
                            id: me.id,
                            avatar: me.avatar,
                            username: me.username,
                          },
                        },
                      },
                    }
                    inputRef.current.value = ''
                    publishData(message)
                    setIsPM(null)
                    setMessages((prev) => [...prev, message.payload])
                  }
                }}
              />
            </div>
          </div>
        )}

        {selectedTab === 'Settings' && typeof roomID === 'string' && (
          <div className="p-4">
            <div>
              <p className="text-muted mb-2">Status</p>
              <div className="bg-bg-2 flex gap-3 rounded-lg p-2 border-2 border-border">
                {statuses.map((s, i) => {
                  return (
                    <button
                      key={s}
                      onClick={() => {
                        if (roomRef.current) {
                          const status = s === 'None' ? '' : s
                          let metadata = {
                            ...JSON.parse(
                              roomRef.current.localParticipant.metadata ?? '{}'
                            ),
                            status,
                          }
                          roomRef.current.localParticipant.setMetadata(
                            JSON.stringify(metadata)
                          )
                          publishData({
                            type: 'Status',
                            payload: { participantID: me.id, status },
                          })
                          updateParticipantStatus(me.id, status)
                        }
                      }}
                      className="px-3 py-1 rounded-full text-sm"
                      style={{
                        backgroundImage:
                          s === status || (i === 0 && status === '')
                            ? 'var(--gradient)'
                            : '',
                      }}
                    >
                      <p>{s}</p>
                    </button>
                  )
                })}
              </div>
            </div>
            {(isMeOwner || isMeCoOwner) && (
              <Accordion type="single" collapsible className="w-full mt-6">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-muted hover:no-underline">
                    Welcome Message
                  </AccordionTrigger>
                  <AccordionContent>
                    <UpdateWelcomeMessage
                      roomID={roomID}
                      defaultValues={{
                        welcomeMessage: room?.welcome_message ?? '',
                      }}
                      onSuccess={(data: { welcomeMessage: string }) => {
                        const { dismiss } = toast({
                          type: 'foreground',
                          className: 'bg-bg-2 text-brand py-4 px-4 w-auto',
                          title: 'Room welcome message updated',
                        })
                        const message: RoomPublishEvent = {
                          type: 'MessageOrLog',
                          payload: {
                            kind: 'WelcomeMessage',
                            payload: {
                              content: data.welcomeMessage,
                              user: {
                                id: me.id,
                                username: me.username,
                                avatar: me.avatar,
                              },
                            },
                          },
                        }
                        setMessages((prev) => [...prev, message.payload])
                        publishData(message)
                        setTimeout(() => {
                          dismiss()
                        }, 1500)
                      }}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        )}
      </div>

      <Dialog
        open={Boolean(open)}
        onOpenChange={(open) => setOpen(open ? -1 : 0)}
      >
        <DialogContent className="p-4 py-6">
          <KickParticipant
            kicked={open}
            kicked_by={me.id}
            close={(kick) => {
              if (kick) {
                publishData({
                  type: 'MessageOrLog',
                  payload: { kind: 'Kick', payload: kick },
                })
                setMessages((prev) => [
                  ...prev,
                  { kind: 'Kick', payload: kick },
                ])
                setOpen(0)
              }
            }}
            roomID={roomID}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
