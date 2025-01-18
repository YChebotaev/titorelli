import { getUserInRoute } from "@/lib/server/get-user-in-route";
import { getUserNotificationService } from "@/lib/server/services/instances";
import { NextResponse, type NextRequest } from "next/server";

export const GET = async ({}: NextRequest) => {
  const user = await getUserInRoute()

  if (!user)
    throw new Error('User not authenticated for route')

  const userNotificationService = getUserNotificationService()

  return NextResponse.json({
    unreadCount: await userNotificationService.countUnread(user.id)
  })
}
