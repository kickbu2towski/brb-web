export type User = {
  id: string
  username: string
  email: string
  email_verified: boolean
  avatar: string
  bio: string
}

export type UserIdentity = Pick<User, 'id' | 'username' | 'avatar'>

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
  [key: string]: string[]
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
    } | {
      type: 'Publish'
      payload: Message
  }
) & { broadcastTo: string[]; user_id: string; event: 'DMEvent' }
