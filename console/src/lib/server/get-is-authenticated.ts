import { getUserSessionService } from "./services/instances"

export const getIsAuthenticated = async (sessionToken: string | undefined) => {
  const userSessionService = getUserSessionService()

  if (!sessionToken)
    return false

  if (!await userSessionService.verifySessionToken(sessionToken))
    return false

  return true
}
