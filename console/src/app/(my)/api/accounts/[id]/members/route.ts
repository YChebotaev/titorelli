import { NextResponse, type NextRequest } from "next/server";
import { AccountService } from "@/lib/server/services/account-service";
import { maskNumber, unmaskNumber } from "@/lib/server/keymask";
import type { SelectorAccountMemberVm } from "@/types/account-members-selector";

export const GET = async (req: NextRequest, propsPromise: Promise<{ params: { id: string } }>) => {
  const accountId = unmaskNumber((await propsPromise).params.id)
  const accountService = new AccountService()
  const members = await accountService.getAccountMembers(accountId)
  const membersVm = members.map(({ id, username }) => ({ id: maskNumber(id), username } as SelectorAccountMemberVm))

  return NextResponse.json(membersVm)
}
