import { createSecretKey } from "crypto";
import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { env } from "@/lib/server/env";
import { addDays, endOfDay } from "date-fns";
import { maskNumber } from "../keymask";

export type EmailVerificationTokenPayload = JWTPayload & { contactId: string }

export class TokenService {
  private siteOrigin = env.SITE_ORIGIN;
  private secretKey = createSecretKey(env.JWT_SECRET, "utf-8");

  private emailVerificationTokenValidityPeriodInDays = 30

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

  async generateEmailVerificationToken(contactId: number) {
    const expiredAt = this.getExpiredAt(this.emailVerificationTokenValidityPeriodInDays)
    const token = await new SignJWT({ contactId: maskNumber(contactId) })
      .setAudience(this.siteOrigin)
      .setExpirationTime(expiredAt)
      .setNotBefore(new Date())
      .setProtectedHeader({ alg: 'HS256' })
      .sign(this.secretKey)

    return [token, expiredAt]
  }

  async parseEmailVerificationToken(token: string) {
    const { payload } = await jwtVerify<EmailVerificationTokenPayload>(token, this.secretKey)

    return {
      contactId: payload.contactId
    }
  }

  private getExpiredAt(validityPeriodInDays: number) {
    return endOfDay(addDays(new Date(), validityPeriodInDays))
  }
}
