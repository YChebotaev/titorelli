import { env } from '@/lib/env'
import type { Account, AccountInvite } from "@prisma/client"
import { maskNumber } from "../keymask";

export class SmsService {
  private siteOrigin = env.SITE_ORIGIN;

  async sendInviteToAccountSms(phone: string, account: Account, invite: AccountInvite) {
    const joinHref = `${this.siteOrigin}/sms/join/${maskNumber(invite.id)}`
    const message = `Вы приглашены в аккаунт "${account.name}". Чтобы присоединиться, пройдите по ссылке: ${joinHref}s`

    await this.sendSms(phone, message)
  }

  private async sendSms(phone: string, message: string) {
    console.log(`SMS successfully send to = ${phone} with message = "${message}"`)
  }
}
