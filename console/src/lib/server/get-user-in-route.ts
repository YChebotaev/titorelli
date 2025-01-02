import { cookies } from "next/headers"
import { UserSessionService } from '@/lib/server/services/user-session-service'
import { sessionTokenCookieName } from "@/constants"

export const getUserInRoute = async () => {
  const userSessionService = new UserSessionService()
  const c = await cookies()

  const sessionToken = c.get(sessionTokenCookieName)?.value

  if (!sessionToken)
    throw new Error('Can\'t access page without authorization')

  if (!await userSessionService.verifySessionToken(sessionToken))
    throw new Error('Token invalid')

  const user = await userSessionService.getUserBySessionToken(sessionToken)

  if (!user)
    throw new Error('Such user not authorized')

  return user
}
