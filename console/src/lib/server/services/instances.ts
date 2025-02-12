import { AccountService } from "./account-service";
import { EmailClient } from "./email-client";
import { EmailService } from "./email-service";
import { EmailValidationService } from "./email-validation-service";
import { UserNotificationService } from "./user-notification-service";
import { InviteService } from "./invite-service";
import { SmsService } from "./sms-service";
import { TokenService } from "./token-service";
import { UserService } from "./user-service";
import { UserSessionService } from "./user-session-service";
import { DataMarkupService } from "./data-markup-service";
import { AcccessTokenService } from "./access-tokens-service";
import { ModelsService } from "./models-service";
import { BotService } from "./bot-service";

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
export const getUserNotificationService = memoize(() => new UserNotificationService)
export const getDataMarkupService = memoize(() => new DataMarkupService)
export const getAccessTokensService = memoize(() => new AcccessTokenService)
export const getModelsService = memoize(() => new ModelsService)
export const getBotService = memoize(() => new BotService)
