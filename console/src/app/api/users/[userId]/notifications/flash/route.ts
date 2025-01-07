import { NextResponse } from "next/server";
import { getUserInRoute } from "@/lib/server/get-user-in-route";
import { maskNumber } from "@/lib/server/keymask";
import { getUserNotificationService } from "@/lib/server/services/instances";
import type { UserNotificationVm } from "@/types/user-notification";
import { UserNotification } from "@prisma/client";

const dbNotificationToVm = ({
  id,
  type,
  payload
}: UserNotification) => ({
  id: maskNumber(id),
  flash: true,
  type,
  payload: JSON.parse(payload)
} as UserNotificationVm)

export const GET = async () => {
  const user = await getUserInRoute()

  if (!user)
    return NextResponse.json([])

  const userNotificationService = getUserNotificationService()
  const flashNotifications = await userNotificationService.getUnreceivedUserFlashNotifications(user.id)

  return NextResponse.json(flashNotifications.map(dbNotificationToVm))
}
