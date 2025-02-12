import { NextResponse, type NextRequest } from "next/server";
import { unmaskNumber } from "@/lib/server/keymask";
import { getBotService, getModelsService } from "@/lib/server/services/instances";
import { BotCreateRequestDataVm, mapBotDtoToVm } from "@/types/bot";

export const GET = async ({ }: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string }> }) => {
  const { id: accountIdStr } = await paramsPromise
  const accountId = unmaskNumber(accountIdStr)

  if (accountId == null)
    throw new Error('Account id not provided')

  // TODO: Check if account exist and user have access to it

  const botService = getBotService()
  const bots = await botService.list(accountId)

  const result = bots.map(mapBotDtoToVm)

  return NextResponse.json(result)
}

export const POST = async (req: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string }> }) => {
  const { id: accountIdStr } = await paramsPromise
  const accountId = unmaskNumber(accountIdStr)

  if (accountId == null)
    throw new Error('Account id not provided')

  const data = await req.json() as Awaited<BotCreateRequestDataVm>

  // TODO: Check if account exist and user have access to it

  const botService = getBotService()
  const modelsService = getModelsService()

  await botService.create(accountId, {
    name: data.name,
    description: data.description,
    bypassTelemetry: data.bypassTelemetry,
    modelId: await modelsService.getModelIdByCode(accountId, data.modelCode),
    accessTokenId: unmaskNumber(data.accessTokenId),
    tgBotToken: data.tgBotToken
  })

  return NextResponse.json({ ok: true })
}
