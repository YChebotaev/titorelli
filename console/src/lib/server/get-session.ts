import { prismaClient } from "./prisma-client"
import { sessionTokenCookieName } from "@/constants"
import { UserSessionService } from "./services/user-session-service"

export const getSession = async (withUser: boolean = false) => {
  const { cookies } = await import("next/headers")
  const userSessionService = new UserSessionService()
  const c = await cookies()
  const token = c.get(sessionTokenCookieName)?.value

  if (!token)
    throw new Error('Request not signed with session cookie')

  if (!userSessionService.verifySessionToken(token))
    throw new Error('Token in session invalid')

  return prismaClient.userSession.findFirst({
    where: {
      token
    },
    include: {
      user: withUser
    }
  })
}
