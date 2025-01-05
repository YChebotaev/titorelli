import { getUserSessionService } from "./services/instances"

export const getIsAuthenticated = async (sessionToken: string | undefined) => {
  if (!sessionToken)
    return false

  const userSessionService = getUserSessionService()

  if (!await userSessionService.verifySessionToken(sessionToken))
    return false

  return true
}
