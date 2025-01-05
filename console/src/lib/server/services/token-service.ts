import { createSecretKey } from "crypto";
import { jwtVerify, SignJWT } from "jose";
import { env } from "@/lib/env";

export class TokenService {
  private siteOrigin = env.SITE_ORIGIN;
  private secretKey = createSecretKey(env.JWT_SECRET, "utf-8");

  async generateSignupPrefilledValidationToken(searchParams: URLSearchParams) {
    const payload: Record<string, string> = {}

    searchParams.forEach((value, key) => {
      payload[key] = value
    })

    const token = await new SignJWT(payload)
      .setAudience(this.siteOrigin)
      .setProtectedHeader({ alg: "HS256" })
      .sign(this.secretKey)

    return token
  }

  async validateSignupPrefilledValidationToken(rawSearchParams: Record<string, string>, token: string) {
    const searchParams = new URLSearchParams(rawSearchParams)
    const { payload } = await jwtVerify(token, this.secretKey)
    let success = true

    searchParams.forEach((value, key) => {
      if (key === 'v')
        return

      if (!success)
        return

      if (value !== Reflect.get(payload, key)) {
        success = false
      }
    })

    return success
  }
}
