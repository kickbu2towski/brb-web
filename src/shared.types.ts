export type Room = {
  id: string
  topic: string
  welcome_message: string
  language: string
  participants: RoomParticipant[]
  owner: UserIdentity
  co_owners: UserIdentity[]
  kicked_users: Kick[]
}

export type User = {
  id: number
  username: string
  avatar: string
  bio: string
}

export type Kick = {
  kicked: number
  kicked_by: number
  timeout: number
  kicked_at: string
  reason: string
}

export type UserIdentity = Pick<User, 'id' | 'username' | 'avatar'>

export type RoomParticipant = UserIdentity & { sid?: string; status?: string }

export type Relation = 'friends' | 'following' | 'followers'

export type UnreadCount = {
  [key: string]: number
}

export type Message = {
  id: string
  content: string
  dm_id: number
  user: UserIdentity
  created_at: string
  is_deleted?: boolean
  is_edited?: boolean
  reply_to_id?: string
  reactions?: Reactions
}

type PayloadMessage = Omit<Message, 'user'>

type Reactions = {
  [key: string]: number[]
}

export type PayloadEdit = {
  id: string
  content: string
  dm_id: number
}

export type PayloadReaction = {
  id: string
  dm_id: number
  reaction: string
  toRemove: boolean
}

export type PayloadDelete = {
  id: string
  dm_id: number
}

export type PublisEvent = (
  | {
      type: 'DM'
      payload: Message
    }
  | {
      type: 'RoomStarted'
      payload: Room
    }
  | {
      type: 'RoomFinished'
      payload: { id: string }
    }
  | {
      type: 'ParticipantJoined'
      payload: { roomID: string; participant: RoomParticipant }
    }
  | {
      type: 'ParticipantLeft'
      payload: { roomID: string; participantID: string }
    }
) & { name: 'PublishEvent' }

export type DMEvent = (
  | {
      type: 'Create'
      payload: PayloadMessage
    }
  | {
      type: 'Edit'
      payload: PayloadEdit
    }
  | {
      type: 'Delete'
      payload: PayloadDelete
    }
  | {
      type: 'Reaction'
      payload: PayloadReaction
    }
) & { broadcastTo: number[]; user_id: number; name: 'DMEvent' }

export type RoomPublishEvent =
  | {
      type: 'MessageOrLog'
      payload:
        | {
            kind: 'Message'
            payload: {
              id: string
              content: string
              user: RoomParticipant
              created_at: string
              is_deleted?: boolean
              pm?: UserIdentity
            }
          }
        | {
            kind: 'SetCoOwner'
            payload: {
              owner: UserIdentity
              co_owner: UserIdentity
            }
          }
        | {
            kind: 'UnsetCoOwner'
            payload: {
              owner: UserIdentity
              co_owner: UserIdentity
            }
          }
        | {
            kind: 'ClearChat'
            payload: {
              clearer: UserIdentity
              cleared: UserIdentity
            }
          }
        | {
            kind: 'Topic'
            payload: {
              content: string
              user?: UserIdentity
            }
          }
        | {
            kind: 'WelcomeMessage'
            payload: {
              content: string
              user?: UserIdentity
            }
          }
        | {
            kind: 'Kick'
            payload: Kick
          }
    }
  | {
      type: 'Status'
      payload: {
        participantID: number
        status: string
      }
    }

export type RoomMessageOrLogPayload = Extract<
  RoomPublishEvent,
  { type: 'MessageOrLog' }
>['payload']
