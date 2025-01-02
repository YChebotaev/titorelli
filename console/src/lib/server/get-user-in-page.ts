import { cookies } from "next/headers"
import { sessionTokenCookieName } from "@/constants"
import { getUserSessionService } from "./services/instances"
import { getIsAuthenticated } from "./get-is-authenticated"

export const getUserInPage = async () => {
  const userSessionService = getUserSessionService()
  const c = await cookies()
  const sessionToken = c.get(sessionTokenCookieName)?.value

  if (await getIsAuthenticated(sessionToken)) {
    return userSessionService.getUserBySessionToken(sessionToken!)
  }

  return null
}
