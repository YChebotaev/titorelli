import { NextResponse, type NextRequest } from "next/server";
import type { UserNotification } from '@prisma/client'
import { getUserInRoute } from "@/lib/server/get-user-in-route";
import { getUserNotificationService } from "@/lib/server/services/instances";
import type { GetHeaderNotificationsData, HeaderNotificationVm } from "@/types/user-notification";
import { maskNumber } from "@/lib/server/keymask";
import { PaginatedItems } from "@/lib/server/PaginatedItems";

const dbNotificationToVm = ({
  id,
  flash,
  type,
  payload,
  createdAt,
  read,
  received
}: UserNotification) => ({
  id: maskNumber(id),
  flash,
  type,
  payload: JSON.parse(payload),
  createdAt: createdAt.toISOString(),
  read,
  received
} as HeaderNotificationVm)

export const POST = async (req: NextRequest) => {
  const user = await getUserInRoute()

  if (!user)
    return NextResponse.json([])

  const { page, size } = await req.json() as Awaited<GetHeaderNotificationsData>

  const userNotificationService = getUserNotificationService()

  const [notifications, total] = await userNotificationService.getPaginatedNotifications(user.id, page, size)

  return NextResponse.json(
    new PaginatedItems(
      notifications.map(dbNotificationToVm),
      total,
      page,
      size
    )
  )
}
