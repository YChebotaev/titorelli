import { getUserInRoute } from "@/lib/server/get-user-in-route";
import { maskNumber } from "@/lib/server/keymask";
import { getFlashMessageService } from "@/lib/server/services/instances";
import { UserFlashNotificationVm } from "@/types/flash-notifications";
import { NextResponse } from "next/server";

export const GET = async () => {
  const user = await getUserInRoute()

  if (!user)
    return NextResponse.json([])

  const flashMessagesService = getFlashMessageService()

  const notifications = await flashMessagesService.getUnreceivedUserNotifications(user.id)
  const notificationsVms = notifications.map(({ id, notificationType, payload }) => ({
    id: maskNumber(id),
    type: notificationType,
    payload: payload ? JSON.parse(payload) : undefined
  } as UserFlashNotificationVm))

  return NextResponse.json(notificationsVms)
}
