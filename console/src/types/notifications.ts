export interface Notification {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  action: string
  target: string
  timestamp: Date
  read: boolean
}

export interface NotificationGroup {
  label: string
  notifications: Notification[]
}
