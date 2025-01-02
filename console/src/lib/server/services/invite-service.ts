import { isValidPhoneNumber } from "libphonenumber-js";
import { Account } from "@prisma/client";
import { formatPhoneNumber } from "../format-phone-number";
import { getAccountService, getEmailService, getEmailValidationService, getSmsService } from "./instances";

export class InviteService {
  get emailService() {
    return getEmailService()
  }

  get smsService() {
    return getSmsService()
  }

  get emailValidationService() {
    return getEmailValidationService()
  }

  get accountService() {
    return getAccountService()
  }

  async sendInviteToIdentity(identity: string, accountId: number, role: string) {
    const account = await this.accountService.getAccount(accountId)

    if (!account)
      throw new Error(`Cant find account by id = ${accountId}`)

    if (this.isEmail(identity)) {
      await this.sendEmailInviteToEmail(identity, account)
    } else
      if (this.isPhoneNumber(identity)) {
        await this.sendSmsInviteToPhone(identity, account)
      }
      else if (this.isUsername(identity)) {
        await this.sendEmailInviteToRegisteredUser(identity, account)
      }
  }

  private async sendEmailInviteToEmail(email: string, account: Account) {
    await this.emailService.sendInviteUnregisteredToAccount(email, account)
  }

  private async sendSmsInviteToPhone(rawPhone: string, account: Account) {
    const phone = formatPhoneNumber(rawPhone)

    if (!phone)
      throw new Error(`Phone number = "${rawPhone}" cannot be formatted`)

    await this.smsService.sendInviteToAccountSms(phone, account)
  }

  private async sendEmailInviteToRegisteredUser(username: string, account: Account) {
    await this.emailService.sendInviteToAccountByUsername(username, account)
  }

  private isPhoneNumber(phone: string) {
    return isValidPhoneNumber(phone, 'RU')
  }

  private isEmail(email: string) {
    return this.emailValidationService.isEmail(email)
  }

  private isUsername(username: string) {
    return Boolean(username)
  }
}
