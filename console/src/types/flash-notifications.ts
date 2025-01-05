import type { UserNotificationPayloadType, NotificationTypes } from "@/lib/server/services/flash-message-service"

export type UserFlashNotificationVm = {
  id: string
  type: NotificationTypes
  payload: UserNotificationPayloadType
}

export type ReceiveNotificationsData = {
  ids: string[]
}
