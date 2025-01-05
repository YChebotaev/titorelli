import { cookies } from "next/headers"
import { sessionTokenCookieName } from "@/constants"
import { getIsAuthenticated } from "./get-is-authenticated"
import { getUserSessionService } from "./services/instances"

export const getUserInRoute = async () => {
  const userSessionService = getUserSessionService()
  const c = await cookies()
  const sessionToken = c.get(sessionTokenCookieName)?.value

  if (await getIsAuthenticated(sessionToken)) {
    return userSessionService.getUserBySessionToken(sessionToken!)
  }

  return null
}
