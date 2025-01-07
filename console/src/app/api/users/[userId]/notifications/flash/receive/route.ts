import { NextResponse, type NextRequest } from "next/server";
import { type ReceiveNotificationsData } from "@/types/user-notification";
import { getUserNotificationService } from "@/lib/server/services/instances";
import { unmaskNumber } from "@/lib/server/keymask";

export const POST = async (req: NextRequest) => {
  const flashMessagesService = getUserNotificationService()
  const { ids: idsStr } = await req.json() as Awaited<ReceiveNotificationsData>

  await flashMessagesService.markReceivedUserNotifications(idsStr.map(idStr => unmaskNumber(idStr)))

  return new NextResponse(null, { status: 200 })
}
