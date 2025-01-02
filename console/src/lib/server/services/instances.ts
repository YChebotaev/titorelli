import { AccountService } from "./account-service";
import { EmailService } from "./email-service";
import { EmailValidationService } from "./email-validation-service";
import { InviteService } from "./invite-service";
import { SmsService } from "./sms-service";
import { UserService } from "./user-service";
import { UserSessionService } from "./user-session-service";

const memoize = <T>(fn: () => T) => {
  let cache: T | null = null

  return () => cache = cache ?? fn()
}

export const getAccountService = memoize(() => new AccountService())
export const getEmailService = memoize(() => new EmailService())
export const getEmailValidationService = memoize(() => new EmailValidationService())
export const getInviteService = memoize(() => new InviteService())
export const getSmsService = memoize(() => new SmsService())
export const getUserService = memoize(() => new UserService())
export const getUserSessionService = memoize(() => new UserSessionService())
