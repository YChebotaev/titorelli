import type { UserNotificationPayloadType, NotificationTypes } from "@/lib/server/services/flash-message-service"

export type UserFlashNotificationVm<P extends UserNotificationPayloadType = UserNotificationPayloadType> = {
  id: string
  type: NotificationTypes
  payload: P
}

export type ReceiveNotificationsData = {
  ids: string[]
}
