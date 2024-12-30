'use server'

import { getUserInAction } from "@/lib/server/get-user-in-action"
import { maskNumber } from "@/lib/server/keymask"
import { AccountService } from "@/lib/server/services/account-service"
import { ProfileAccountVm } from "@/types/my-profile"
import { AccountMember, User } from "@prisma/client"

const getOwnerFromMembers = (members: (AccountMember & { user: User })[]) =>
  members.find(({ role }) => role === 'owner')

export const getAccounts = async () => {
  const user = await getUserInAction()
  const accountService = new AccountService()
  const accounts = await accountService.getAccountsUserMemberOf(user.id)

  return (await Promise.all(
    accounts.map(async ({ id, name, members }) => {
      const owner = getOwnerFromMembers(members)
      const role = await accountService.getUserRoleInAccount(user.id, id)

      if (!owner || !role)
        return null

      return {
        id: maskNumber(id),
        name,
        owner: {
          id: maskNumber(owner.user.id),
          username: owner.user.username
        },
        role
      } as ProfileAccountVm
    })
  )).filter(profileAccount => profileAccount) as ProfileAccountVm[]
}
