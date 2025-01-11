import type {
  UserNotificationPayloads,
  GenericToasPayload,
  JoinToAccountsPayload,
  UserNotificationTypes
} from '@/lib/server/services/user-notification-service'

export {
  UserNotificationPayloads,
  GenericToasPayload,
  JoinToAccountsPayload,
  UserNotificationTypes
}

export type UserNotificationVm<P extends UserNotificationPayloads = UserNotificationPayloads> = {
  id: string
  flash: boolean
  type: UserNotificationTypes
  payload: P
}

export type HeaderNotificationVm<P extends UserNotificationPayloads = UserNotificationPayloads> = {
  id: string
  flash: boolean
  type: UserNotificationTypes
  payload: P
  createdAt: string
  read: boolean
  received: boolean
}

export interface HeaderNotificationGroupVm {
  label: string
  notifications: HeaderNotificationVm[]
}

export type ReceiveNotificationsData = {
  ids: string[]
}

export type GetHeaderNotificationsData = {
  page: number
  size: number
}

export type UnreadCountVm = {
  unreadCount: number
}
