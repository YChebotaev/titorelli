'use server'

import { LeaveFormState, LeaveIntents } from "@/components/my-profile/accounts-list/account-item/leave-button"
import { unmaskNumber } from "@/lib/server/keymask"
import { AccountService } from "@/lib/server/services/account-service"

export const leaveAccount = async (prevState: LeaveFormState, form: FormData) => {
  const accountService = new AccountService()

  const intent = form.get('intent')?.toString() as LeaveIntents | undefined
  const accountIdMasked = form.get('account_id')?.toString()
  const newOwnerIdMasked = form.get('new_owner_id')?.toString()
  const nextState: LeaveFormState = {
    success: null,
    errors: {}
  }

  if (!accountIdMasked) {
    nextState.errors.account_id = 'Номер аккаунта не указан'

    return nextState
  }

  if (intent === 'new_owner' && !newOwnerIdMasked) {
    nextState.errors.new_owner_id = 'Получатель прав владельца не указан'

    return nextState
  }

  const accountId = unmaskNumber(accountIdMasked)

  switch (intent) {
    case 'wipe':
      nextState.success = await accountService.wipeAndRemoveAccount(accountId)

      break
    case 'new_owner':
      const newOwnerId = unmaskNumber(newOwnerIdMasked!)

      nextState.success = await accountService.transferOwnership(accountId, newOwnerId)

      break
  }

  return nextState
}
