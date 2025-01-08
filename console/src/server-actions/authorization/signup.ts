'use server'

import { cookies } from "next/headers"
import { redirect } from 'next/navigation'
import { isValidPhoneNumber } from "libphonenumber-js"
import { activeAccountCookueName, sessionTokenCookieName, signupFormInitialState } from '@/constants'
import { UserService } from "@/lib/server/services/user-service"
import { AccountValueTypes } from "@/types/authoriaztion"
import {
  getAccountService,
  getEmailService,
  getEmailValidationService,
  getInviteService,
  getUserNotificationService,
  getUserSessionService
} from "@/lib/server/services/instances"
import { maskNumber } from "@/lib/server/keymask"
import { type SignupFormState } from "@/components/authorization/signup-form"
import { mapFilterAsync } from "@/lib/utils"

export async function signup(prevState: SignupFormState, form: FormData) {
  const userService = new UserService()
  const emailValidationService = getEmailValidationService()
  const sessionService = getUserSessionService()
  const accountService = getAccountService()
  const inviteService = getInviteService()
  const notificationService = getUserNotificationService()
  const emailService = getEmailService()
  const userNotificationService = getUserNotificationService()
  const c = await cookies()

  const errors: Record<keyof typeof prevState['errors'], string> = Object.create(Object.prototype)
  const username = form.get('username')?.toString()
  const email = form.get('email')?.toString()
  const phone = form.get('phone')?.toString()
  const password = form.get('password')?.toString()
  const passwordConfirm = form.get('password_confirm')?.toString()
  const account = form.get('account')?.toString() as AccountValueTypes | undefined
  const accountName = form.get('account_name')?.toString()
  const acceptTerms = form.get('accept_terms')?.toString() === 'on'
  const acceptPdp = form.get('accept_pdp')?.toString() === 'on'
  const acceptSubscription = form.get('accept_subscription')?.toString() === 'on'

  const nextState: SignupFormState = {
    defaultValues: {
      username: username ?? signupFormInitialState.defaultValues.username,
      email: email ?? signupFormInitialState.defaultValues.email,
      phone: phone ?? signupFormInitialState.defaultValues.phone,
      account: account ?? signupFormInitialState.defaultValues.account,
      account_name: account ?? signupFormInitialState.defaultValues.account_name,
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

  if (password !== passwordConfirm) {
    errors.password_confirm = 'Подтверждение не совпадает с паролем'

    return nextState
  }

  if (!account) {
    errors.account = 'Не выбрано что сделать с аккаунтом при геристрации'

    return nextState
  }

  if (account === 'set_name' && !accountName) {
    errors.account_name = 'Не выбрано имя аккаунта'

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

  const userId = await userService.createUserWithSignupData(
    username,
    email,
    phone,
    password,
    acceptTerms,
    acceptPdp,
    acceptSubscription
  )

  let accountId: number | null = null

  switch (account) {
    case "default_name":
      accountId = await accountService.createDefaultAccountForUser(userId)
      break
    case 'no_account':
      // Do nothing
      break
    case 'set_name':
      accountId = await accountService.createAccountWithNameForUser(userId, accountName!)
      break
  }

  // Send email verification request
  {
    await emailService.sendEmailVerificationRequest(userId, email)

    await userNotificationService.verificationEmailSent(userId, email)
  }

  // Set session token cookie and active account
  {
    const token = await sessionService.createSession(userId)

    c.set(sessionTokenCookieName, token, {
      httpOnly: true,
      secure: false // TODO: Enable for production
    })

    if (accountId != null) {
      c.set(activeAccountCookueName, maskNumber(accountId), { httpOnly: false, secure: false })
    }
  }

  // Join into accounts if any invite pending
  {
    const { accountIds } = await inviteService.maybeJoinPendingInvites(userId, email, phone, username)
    const accounts = await mapFilterAsync(accountIds, accountService.getAccount.bind(accountService))

    await notificationService.accountsJoin(userId, accounts)
  }

  redirect('/my/profile')
}
