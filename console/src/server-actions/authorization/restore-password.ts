'use server'

import { RestoreFormState } from "@/components/authorization/restore-password-form"
import { restoreFormInitialState } from "@/constants"
import { EmailService } from "@/lib/server/services/email-service"
import { EmailValidationService } from "@/lib/server/services/email-validation-service"
import { UserService } from "@/lib/server/services/user-service"

/**
 * Из соображений безопасности, на фронт
 * не уходят данные, что пользователь не найден
 */
export async function restorePassword(prevState: RestoreFormState, form: FormData) {
  const userService = new UserService()
  const emailService = new EmailService()
  const emailValidationService = new EmailValidationService()

  const identity = form.get('identity')?.toString()

  const nextState: RestoreFormState = {
    success: null,
    defaultValues: {
      identity: identity ?? restoreFormInitialState.defaultValues.identity,
    },
    errors: {}
  }

  if (!identity) {
    nextState.errors.identity = 'Идентификатор не заполнен'

    return nextState
  }

  const [success, userId] = await userService.tryRestore(identity)

  if (!success || userId == null) {
    console.warn(`Пользователя с идентификатором "${identity}" не удалось найти`)
  } else {
    const isEmail = emailValidationService.isEmail(identity)

    await emailService.sendRestorePasswordEmail(userId, isEmail ? identity : '*')
  }

  nextState.success = true

  return nextState
}