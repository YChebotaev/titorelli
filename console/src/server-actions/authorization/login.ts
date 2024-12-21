'use server'

import { UserService } from '@/lib/server/services/user-service'

export async function login(form: FormData) {
  const email = form.get('email')?.toString()
  const rawPassword = form.get('password')?.toString()

  if (!email)
    throw new Error('Email not provided')

  if (!rawPassword)
    throw new Error('Password not provided')

  const success = await new UserService().tryLogin(email, rawPassword)

  if (!success)
    throw new Error('Cannot login with given credentials')

  return undefined
}
