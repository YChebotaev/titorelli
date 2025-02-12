import { NextResponse, type NextRequest } from "next/server";
import { unmaskNumber } from "@/lib/server/keymask";
import { getModelsService } from "@/lib/server/services/instances";
import { mapModelDtoToVm, ModelVM } from "@/types/model";

export const GET = async ({ }: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string }> }) => {
  const { id: accountIdStr } = await paramsPromise
  const accountId = unmaskNumber(accountIdStr)

  if (accountId == null)
    throw new Error('Account id not provided')

  // TODO: Check if account exist and user have access to it

  const modelsService = getModelsService()
  const models = await modelsService.list(accountId)

  const result: ModelVM[] = models.map(mapModelDtoToVm)

  return NextResponse.json(result)
}
