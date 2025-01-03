import { NextResponse } from "next/server"
import { getUserInRoute } from "@/lib/server/get-user-in-route"
import { maskNumber } from "@/lib/server/keymask"
import { UserAccountVm } from "@/types/header"
import { getAccountService } from "@/lib/server/services/instances"

export const GET = async () => {
  const accountService = getAccountService()
  const user = await getUserInRoute()
  const accounts = await accountService.getAccountsUserMemberOf(user.id)
  const accountsVm = accounts.map(({ id, name }) => ({ id: maskNumber(id), name } as UserAccountVm))

  return NextResponse.json(accountsVm)
}
