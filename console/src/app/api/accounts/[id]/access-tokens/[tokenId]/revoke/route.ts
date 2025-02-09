import { unmaskNumber } from "@/lib/server/keymask"
import { getAccessTokensService } from "@/lib/server/services/instances"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string, tokenId: string }> }) => {
  const { id: accountIdStr, tokenId: tokenIdStr } = await paramsPromise
  const accountId = unmaskNumber(accountIdStr)
  const tokenId = unmaskNumber(tokenIdStr)

  if (accountId == null)
    throw new Error('Account id not provided')

  if (tokenId == null)
    throw new Error('Token id not provieded')

  // TODO: Check if account and token exists and user have access to them

  const accessTokensService = getAccessTokensService()

  await accessTokensService.revoke(tokenId)

  return NextResponse.json({ ok: true })
}
