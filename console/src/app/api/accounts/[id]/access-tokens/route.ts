import { NextResponse, type NextRequest } from "next/server"
import { maskNumber, unmaskNumber } from "@/lib/server/keymask"
import { getAccessTokensService } from "@/lib/server/services/instances"
import type { AccessTokenCreatedRequestDataVm, AccessTokenCreatedResultVm, AccessTokenVm } from "@/types/access-tokens"

export const GET = async ({ }: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string }> }) => {
  const { id: accountIdStr } = await paramsPromise
  const accountId = unmaskNumber(accountIdStr)

  if (accountId == null)
    throw new Error('Account id not provided')

  // TODO: Check if account exist and user have access to it

  const accessTokensService = getAccessTokensService()
  const accountTokens = await accessTokensService.list(accountId)

  const result: AccessTokenVm[] = accountTokens
    .map(({
      id,
      name,
      description,
      createdAt,
      updatedAt
    }) => ({
      id: maskNumber(id),
      name,
      description,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString()
    }))

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

  const token = await accessTokensService.create(accountId, name, description)
  const result: AccessTokenCreatedResultVm = { token }

  return NextResponse.json(result)
}
