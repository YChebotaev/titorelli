import { getUserInRoute } from "@/lib/server/get-user-in-route";
import { unmaskNumber } from "@/lib/server/keymask";
import { getUserNotificationService } from "@/lib/server/services/instances";
import { ReceiveNotificationsData } from "@/types/user-notification";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  await getUserInRoute()

  const userNotificationService = getUserNotificationService()
  const { ids: idsStr } = await req.json() as Awaited<ReceiveNotificationsData>

  console.log('idsStr =', idsStr)

  await userNotificationService.markRead(idsStr.map(idStr => unmaskNumber(idStr)))

  return new NextResponse(null, { status: 200 })
}
