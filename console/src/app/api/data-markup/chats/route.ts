import { maskNumber, unmaskNumber } from "@/lib/server/keymask"
import { getDataMarkupService } from "@/lib/server/services/instances"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest) => {
  const accountId = unmaskNumber(req.nextUrl.searchParams.get('accountId'))

  if (!accountId)
    return new NextResponse('Account id not provided in query parameter', { status: 400 })

  const dataMarkupService = getDataMarkupService()

  const chats = await dataMarkupService.getChats(accountId)

  for (const chat of chats) {
    chat.id = maskNumber(Number(chat.id))
  }

  return NextResponse.json(chats)
}
