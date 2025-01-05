import { NextResponse, type NextRequest } from "next/server";
import { type ReceiveNotificationsData } from "@/types/flash-notifications";
import { getFlashMessageService } from "@/lib/server/services/instances";
import { unmaskNumber } from "@/lib/server/keymask";

export const POST = async (req: NextRequest) => {
  const flashMessagesService = getFlashMessageService()
  const { ids: idsStr } = await req.json() as Awaited<ReceiveNotificationsData>

  await flashMessagesService.markReceivedUserNotifications(idsStr.map(idStr => unmaskNumber(idStr)))

  return new NextResponse(null, { status: 200 })
}
