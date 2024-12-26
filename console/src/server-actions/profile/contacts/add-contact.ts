'use server'

import { isValidPhoneNumber } from "libphonenumber-js";
import { ContactType } from "@/components/my-profile/contacts-list";
import { AddConcactFormState } from "@/components/my-profile/contacts-list/add-contact-form";
import { getSession } from "@/lib/server/get-session";
import { EmailValidationService } from "@/lib/server/services/email-validation-service";
import { UserService } from "@/lib/server/services/user-service";
import { addContactFormInitialState } from "@/constants";

export const addContact = async (prevState: AddConcactFormState, form: FormData) => {
  const userService = new UserService()
  const emailValidationService = new EmailValidationService()
  const session = await getSession()
  const type = form.get('type')?.toString().trim() as ContactType | undefined
  const value = form.get('value')?.toString().trim()

  const nextState: AddConcactFormState = {
    success: null,
    defaultValues: addContactFormInitialState.defaultValues,
    errors: {}
  }

  if (!session) {
    return nextState
  }

  if (!type) {
    nextState.errors.type = 'Не указан тип контакта'

    return nextState
  }

  if (!value) {
    nextState.errors.value = 'Контакт не указан'

    return nextState
  }

  if (!['email', 'phone', 'telegram'].includes(type)) {
    nextState.errors.type = 'Тип контакта указан не верно'

    return nextState
  }

  if (type === 'email') {
    if (!emailValidationService.validateEmail(value)) {
      nextState.errors.value = 'Невалидный емейл'

      return nextState
    }

    await userService.addEmailContact(session?.userId, value)

    nextState.success = true

    return nextState
  }

  if (type === 'phone') {
    if (!isValidPhoneNumber(value, 'RU')) {
      nextState.errors.value = 'Невалидный номер телефона'

      return nextState
    }

    await userService.addPhoneContact(session?.userId, value)

    nextState.success = true

    return nextState
  }

  if (type === 'telegram') {
    await userService.addTelegramContact(session.userId, value)

    return nextState
  }

  return nextState
}
