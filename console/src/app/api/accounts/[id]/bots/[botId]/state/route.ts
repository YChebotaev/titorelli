import { NextResponse, type NextRequest } from "next/server";
import { unmaskNumber } from "@/lib/server/keymask";
import { getBotService } from "@/lib/server/services/instances";
import { BotStateChangeRequestDataVm } from "@/types/bot";

export const POST = async (req: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string, botId: string }> }) => {
  const { id: accountIdStr, botId: botIdStr } = await paramsPromise
  const accountId = unmaskNumber(accountIdStr)
  const botId = unmaskNumber(botIdStr)!

  if (accountId == null)
    throw new Error('Account id not provided')

  if (botId == null)
    throw new Error('Bot id not provided')

  // TODO: Check if bot exist and user have access to it

  const { state } = await req.json() as Awaited<BotStateChangeRequestDataVm>

  const botService = getBotService()
  await botService.changeState(botId, state)

  const newState = await botService.getBotState(botId)

  return NextResponse.json({ state: newState })
}
