import { unmaskNumber } from "@/lib/server/keymask"
import { getAccessTokensService } from "@/lib/server/services/instances"
import { AccessTokenVm, mapAccessTokenDtoToVm } from "@/types/access-tokens"

export const getAccessTokens = async (accountIdStr: string) => {
  const accountId = unmaskNumber(accountIdStr)

  if (accountId == null)
    throw new Error('Account id not provided')

  // TODO: Check if account exist and user have access to it

  const accessTokensService = getAccessTokensService()
  const accountTokens = await accessTokensService.list(accountId)

  const result: AccessTokenVm[] = accountTokens.map(mapAccessTokenDtoToVm)

  return result
}
