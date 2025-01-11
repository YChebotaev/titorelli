import { NextResponse, type NextRequest } from "next/server";
import { type ReceiveNotificationsData } from "@/types/user-notification";
import { getUserNotificationService } from "@/lib/server/services/instances";
import { unmaskNumber } from "@/lib/server/keymask";
import { getUserInRoute } from "@/lib/server/get-user-in-route";

export const POST = async (req: NextRequest) => {
  await getUserInRoute()

  const userNotificationService = getUserNotificationService()
  const { ids: idsStr } = await req.json() as Awaited<ReceiveNotificationsData>

  await userNotificationService.markReceived(idsStr.map(idStr => unmaskNumber(idStr)))

  return new NextResponse(null, { status: 200 })
}
