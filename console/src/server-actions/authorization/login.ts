'use server'

import { cookies } from 'next/headers'
import { UserService } from '@/lib/server/services/user-service'
import { UserSessionService } from '@/lib/server/services/user-session-service'
import { sessionTokenCookieName } from '@/constants'

export async function login(form: FormData) {
  const userService = new UserService()
  const sessionService = new UserSessionService()
  const c = await cookies()

  const email = form.get('email')?.toString()
  const rawPassword = form.get('password')?.toString()

  if (!email)
    throw new Error('Email not provided')

  if (!rawPassword)
    throw new Error('Password not provided')

  const success = await userService.tryLogin(email, rawPassword)

  if (!success)
    throw new Error('Cannot login with given credentials')

  const user = await userService.getUserByEmail(email)

  if (!user)
    throw new Error('Cannot login with given credentials')

  const token = await sessionService.createSession(user.id)

  c.set(sessionTokenCookieName, token, {
    httpOnly: true,
    secure: false // TODO: Enable for production
  })

  return undefined
}
