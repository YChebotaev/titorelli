'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { UserService } from '@/lib/server/services/user-service'
import { UserSessionService } from '@/lib/server/services/user-session-service'
import { sessionTokenCookieName, signinFormInitialState } from '@/constants'
import { SigninFormState } from '@/components/authorization/signin-form'

export async function signin(prevState: SigninFormState, form: FormData) {
  const userService = new UserService()
  const sessionService = new UserSessionService()
  const c = await cookies()

  const identity = form.get('identity')?.toString()
  const rawPassword = form.get('password')?.toString()

  const nextState: SigninFormState = {
    defaultValues: {
      identity: identity ?? signinFormInitialState.defaultValues.identity,
    },
    errors: {}
  }

  if (!identity) {
    nextState.errors.identity = 'Идентификатор не заполнен'

    return nextState
  }

  if (!rawPassword) {
    nextState.errors.password = 'Пароль не заполнен'

    return nextState
  }

  const [success, userId] = await userService.tryLogin(identity, rawPassword)

  if (!success || userId == null) {
    nextState.errors.identity = 'Пароль не подходит'

    return nextState
  }

  const token = await sessionService.createSession(userId)

  c.set(sessionTokenCookieName, token, {
    httpOnly: true,
    secure: false // TODO: Enable for production
  })

  redirect('/my/profile')
}
