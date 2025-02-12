import { NextResponse, type NextRequest } from "next/server"
import { maskNumber, unmaskNumber } from "@/lib/server/keymask"
import { getAccessTokensService } from "@/lib/server/services/instances"
import { mapAccessTokenDtoToVm, type AccessTokenCreatedRequestDataVm, type AccessTokenCreatedResultVm, type AccessTokenVm } from "@/types/access-tokens"

export const GET = async ({ }: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string }> }) => {
  const { id: accountIdStr } = await paramsPromise
  const accountId = unmaskNumber(accountIdStr)

  if (accountId == null)
    throw new Error('Account id not provided')

  // TODO: Check if account exist and user have access to it

  const accessTokensService = getAccessTokensService()
  const accountTokens = await accessTokensService.list(accountId)

  const result: AccessTokenVm[] = accountTokens.map(mapAccessTokenDtoToVm)

  return NextResponse.json(result)
}

export const POST = async (req: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string }> }) => {
  const { id: accountIdStr } = await paramsPromise
  const accountId = unmaskNumber(accountIdStr)

  if (accountId == null)
    throw new Error('Account id not provided')

  // TODO: Check if account exist and user have access to it

  const { name, description } = await req.json() as Awaited<AccessTokenCreatedRequestDataVm>

  const accessTokensService = getAccessTokensService()

  const { token, id } = await accessTokensService.create(accountId, name, description)
  const result: AccessTokenCreatedResultVm = { token, id: maskNumber(id) }

  return NextResponse.json(result)
}
