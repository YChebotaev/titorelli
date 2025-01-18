'use server'

import { getUserInAction } from "@/lib/server/get-user-in-action"
import { maskNumber } from "@/lib/server/keymask"
import { getAccountService } from "@/lib/server/services/instances"
import { mapFilterAsync } from "@/lib/utils"
import { ProfileAccountVm } from "@/types/my-profile"
import { AccountMember, User } from "@prisma/client"

const getOwnerFromMembers = (members: (AccountMember & { user: User | null })[]) =>
  members.find(({ role }) => role === 'owner')

export const getAccounts = async () => {
  const user = await getUserInAction()
  const accountService = getAccountService()
  const accounts = await accountService.getAccountsUserMemberOf(user.id)

  return mapFilterAsync(accounts, async ({ id, name, members }) => {
    const owner = getOwnerFromMembers(members)
    const role = await accountService.getUserRoleInAccount(user.id, id)

    if (!owner || !role || owner.user == null)
      return null

    return {
      id: maskNumber(id),
      name,
      owner: {
        id: maskNumber(owner.user.id),
        username: owner.user.username
      },
      role
    } satisfies ProfileAccountVm
  })
}
