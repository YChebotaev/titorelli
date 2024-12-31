'use server'

import { AddAccountFormValues } from "@/components/my-profile/create-account-btn"
import { formDataToObject } from "@/lib/form-data"
import { createArrayWithSingleValue } from "@/lib/utils"

export type CreateAccountActionResult = {
  success: boolean
  errors: {
    accountName?: string
    members?: ({
      identity?: string
      role?: string
    } | undefined)[]
  }
}

/**
 * @todo
 * 0. Validate phone numbers, emails and usernames
 * 1. Deduplicate members by user id
 * 2. Send invites to unregistered members
 * 3. Send invites to registered members
 * 4. If one of identity is a registered user and another
 *    is same user, but unregistered, what to do?
 *    It manifests itself when user receives invite
 *      and then logs in
 *      Need to stitch this user with given contact
 *        Should such contact be validated?
 *    Need some kind of user stitching
 */
export async function createAccount(form: FormData): Promise<CreateAccountActionResult> {
  const { accountName, members } = formDataToObject<AddAccountFormValues>(form)

  if (!accountName) {
    return { success: false, errors: { accountName: 'Название аккаунта не заполнено' } }
  }

  for (let i = 0; i < members.length; i++) {
    const member = members[i]

    if (!member.identity) {
      return { success: false, errors: { members: createArrayWithSingleValue({ identity: 'Идентификатор участника обязателен' }, i) } }
    }

    if (['editor', 'viewer'].includes(member.role)) {
      return { success: false, errors: { members: createArrayWithSingleValue({ role: 'Роль участника не указана' }, i) } }
    }
  }

  return { success: true, errors: {} }
}
