import type { Account } from "@prisma/client"
import { env } from '@/lib/env'
import { maskNumber } from "../keymask";

export class SmsService {
  private siteOrigin = env.SITE_ORIGIN;

  async sendInviteToAccountSms(phone: string, account: Account) {
    const joinHref = `${this.siteOrigin}/join/${maskNumber(account.id)}`
    const message = `Вы приглашены в аккаунт "${account.name}". Чтобы присоединиться, пройдите по ссылке: ${joinHref}s`

    await this.sendSms(phone, message)
  }

  private async sendSms(phone: string, message: string) {
    console.log(`SMS successfully send to = ${phone} with message = "${message}"`)
  }
}
