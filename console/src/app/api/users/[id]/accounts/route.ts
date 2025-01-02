import { NextResponse } from "next/server"
import { getUserInRoute } from "@/lib/server/get-user-in-route"
import { maskNumber } from "@/lib/server/keymask"
import { AccountService } from "@/lib/server/services/account-service"
import { UserAccountVm } from "@/types/header"

export const GET = async () => {
  const accountService = new AccountService()
  const user = await getUserInRoute()
  const accounts = await accountService.getAccountsUserMemberOf(user.id)
  const accountsVm = accounts.map(({ id, name }) => ({ id: maskNumber(id), name } as UserAccountVm))

  return NextResponse.json(accountsVm)
}
