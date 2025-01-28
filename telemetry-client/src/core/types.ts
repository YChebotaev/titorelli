export type SelfInfo = {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  isPremium?: true;
  addedToAttachmentMenu?: true;
  isBot: true;
  canJoinGroups: boolean;
  canReadAllGroupMessages: boolean;
  supportsInlineQueries: boolean;
}

export type UserInfo = {
  id: number;
  isBot: boolean;
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  isPremium?: true;
  addedToAttachmentMenu?: true;
}

export type ChatInfo = {
  id: number
  type: 'private' | 'group' | 'supergroup' | 'channel'
  username?: string
  title?: string
  firstName?: string
  lastName?: string
  isForum?: boolean
  description?: string
  bio?: string
}

export type MessageInfo = {
  id: number
  type: 'text' | 'media'
  threadId?: number
  fromTgUserId: number
  senderTgChatId: number
  date: number
  tgChatId: number
  isTopic?: boolean
  text?: string
  caption?: string
}
