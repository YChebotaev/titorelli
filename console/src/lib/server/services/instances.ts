import { AccountService } from "./account-service";
import { EmailClient } from "./email-client";
import { EmailService } from "./email-service";
import { EmailValidationService } from "./email-validation-service";
import { FlashMessageService } from "./flash-message-service";
import { InviteService } from "./invite-service";
import { NotificationService } from "./notification-service";
import { SmsService } from "./sms-service";
import { TokenService } from "./token-service";
import { UserService } from "./user-service";
import { UserSessionService } from "./user-session-service";

const memoize = <T>(fn: () => T) => {
  let cache: T | null = null

  return () => cache = cache ?? fn()
}

export const getAccountService = memoize(() => new AccountService)
export const getEmailService = memoize(() => new EmailService)
export const getEmailValidationService = memoize(() => new EmailValidationService)
export const getInviteService = memoize(() => new InviteService)
export const getSmsService = memoize(() => new SmsService)
export const getUserService = memoize(() => new UserService)
export const getUserSessionService = memoize(() => new UserSessionService)
export const getEmailClient = memoize(() => new EmailClient)
export const getTokenService = memoize(() => new TokenService)
export const getFlashMessageService = memoize(() => new FlashMessageService)
export const getNotificationsService = memoize(() => new NotificationService)
