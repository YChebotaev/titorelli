'use server'

import { cookies } from "next/headers"
import { isValidPhoneNumber } from "libphonenumber-js"
import { sessionTokenCookieName, signupFormInitialState } from '@/constants'
import { EmailValidationService } from "@/lib/server/services/email-validation-service"
import { UserService } from "@/lib/server/services/user-service"
import { UserSessionService } from "@/lib/server/services/user-session-service"
import { type SignupFormState } from "@/components/authorization/signup-form"

export async function signup(prevState: SignupFormState, form: FormData) {
  const userService = new UserService()
  const emailValidationService = new EmailValidationService()
  const sessionService = new UserSessionService()
  const c = await cookies()

  const errors: Record<keyof typeof prevState['errors'], string> = Object.create(Object.prototype)
  const username = form.get('username')?.toString()
  const email = form.get('email')?.toString()
  const phone = form.get('phone')?.toString()
  const password = form.get('password')?.toString()
  const passwordConfirm = form.get('password_confirm')?.toString()
  const acceptTerms = form.get('accept_terms')?.toString() === 'on'
  const acceptPdp = form.get('accept_pdp')?.toString() === 'on'
  const acceptSubscription = form.get('accept_subscription')?.toString() === 'on'

  const nextState: SignupFormState = {
    defaultValues: {
      username: username ?? signupFormInitialState.defaultValues.username,
      email: email ?? signupFormInitialState.defaultValues.email,
      phone: phone ?? signupFormInitialState.defaultValues.phone,
      accept_terms: signupFormInitialState.defaultValues.accept_terms,
      accept_pdp: signupFormInitialState.defaultValues.accept_pdp,
      accept_subscription: signupFormInitialState.defaultValues.accept_subscription
    },
    errors
  }

  if (!username) {
    errors.username = 'Ник не заполнен'

    return nextState
  }

  if (!email) {
    errors.email = 'Email не заполен'

    return nextState
  }

  if (!phone) {
    errors.phone = 'Телефон не указан'

    return nextState
  }

  if (!password) {
    errors.password = 'Пароль не указан'

    return nextState
  }

  if (!password) {
    errors.password_confirm = 'Подтверждение не указано'

    return nextState
  }

  if (!userService.validateUsername(username)) {
    errors.username = 'Ник должен быть не меньше трех букв длиной, содержать только латинские буквы или цифры в нижнем регистре, начинаться и заканчиваться буквой, может содержаьь "-" или "_" в середине, но не два раза подряд'

    return nextState
  }

  if (await userService.usernameTaken(username)) {
    errors.username = 'Такой ник уже занят другим пользователем'

    return nextState
  }

  if (!emailValidationService.validateEmail(email)) {
    errors.email = 'Емейл имеет неверный формат'

    return nextState
  }

  if (await userService.emailTaken(email)) {
    errors.email = 'Емейл уже используется'

    return nextState
  }

  if (!isValidPhoneNumber(phone, 'RU')) {
    errors.phone = 'Телефон имеет неверный формат'

    return nextState
  }

  if (await userService.phoneTaken(phone)) {
    errors.phone = 'Телефон уже используется'

    return nextState
  }

  if (password !== passwordConfirm) {
    errors.password_confirm = 'Подтверждение не совпадает с паролем'

    return nextState
  }

  const userId = await userService.createUserWithSignupData(
    username,
    email,
    phone,
    password,
    acceptTerms,
    acceptPdp,
    acceptSubscription
  )

  const token = await sessionService.createSession(userId)

  c.set(sessionTokenCookieName, token, {
    httpOnly: true,
    secure: false // TODO: Enable for production
  })

  return nextState
}
