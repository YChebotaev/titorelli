import { NextResponse, type NextRequest } from "next/server"
import { getUserInRoute } from "@/lib/server/get-user-in-route"
import { maskNumber, unmaskNumber } from "@/lib/server/keymask"
import { getAccountService } from "@/lib/server/services/instances"
import type { UserAccountVm } from "@/types/header"

export const GET = async (req: NextRequest, { params }: { params: Promise<{ accountId: string }> }) => {
  const accountId = unmaskNumber((await params).accountId)
  const accountService = getAccountService()
  const user = await getUserInRoute()
  const account = await accountService.getAccountUserMemberOf(user.id, accountId)

  if (!account)
    throw new Error(`Cannot find account with id = ${accountId} in user id = ${user.id} accounts list`)

  const accountVm = { id: maskNumber(account.id), name: account.name } as UserAccountVm

  return NextResponse.json(accountVm)
}
