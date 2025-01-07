import { Account, AccountInvite } from "@prisma/client";
import _, { bind, first, groupBy, identity, mapValues, values } from "lodash";
import { formatPhoneNumber } from "../format-phone-number";
import { mapAsyncTry, mapFilter } from "@/lib/utils";
import { getAccountService, getEmailService, getEmailValidationService, getSmsService } from "./instances";
import { prismaClient } from "../prisma-client";
import type { IdentityTypes } from "./user-service";
import { unmaskNumber } from "../keymask";

export class InviteService {
  private prisma = prismaClient

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

  async sendInvites(invites: AccountInvite[]) {
    return mapAsyncTry(invites, this.sendInvite.bind(this))
  }

  async sendInvite(invite: AccountInvite) {
    const account = await this.accountService.getAccount(invite.accountId)

    if (!account)
      throw new Error(`Can't find account by id = ${invite.accountId}`)

    if (invite.userId) {
      await this.sendEmailInviteToRegisteredUser(invite.userId, account, invite)
    } else {
      switch (invite.identityType as IdentityTypes) {
        case "email":
          if (!invite.email)
            throw new Error(`Can't send invite to email bc email not set in invite id = ${invite.id}`)

          return this.sendEmailInviteToEmail(invite.email, account, invite)
        case "phone":
          if (!invite.phone)
            throw new Error(`Can't send invite by sms bc phone not set in invite id = ${invite.id}`)

          return this.sendSmsInviteToPhone(invite.phone, account, invite)
        case "username":
          throw new Error('Invite cannot be sent by username if user not registered')
      }
    }
  }

  async getAccountAndInviteFromAccountJoinTokenFromEmail(token: string): Promise<[Account | null, AccountInvite | null]> {
    const payload = await this.emailService.parseAccountJoinTokenFromEmail(token)

    if (!payload)
      return [null, null]

    const invite = await this.prisma.accountInvite.findFirst({
      where: { id: unmaskNumber(payload.inviteId) }
    })

    if (!invite)
      return [null, null]

    const account = await this.prisma.account.findFirst({
      where: { id: invite.accountId }
    })

    return [account, invite]
  }

  async joinRegisteredUserToAccount(invite: AccountInvite, userId?: number) {
    return this.prisma.$transaction(async (t) => {
      await t.accountMember.create({
        data: {
          role: invite.role,
          userId: userId ?? invite.userId!,
          accountId: invite.accountId
        }
      })

      await t.accountInvite.delete({
        where: { id: invite.id }
      })

      return { accountId: invite.accountId }
    })
  }

  async maybeJoinPendingInvites(userId: number, email: string, phone: string, username: string) {
    const userInvites = await this.prisma.accountInvite.findMany({
      where: {
        OR: [
          { userId },
          { email, userId: null },
          { phone, userId: null },
          { username, userId: null },
        ]
      }
    })

    const uniqueByAccountInvites: AccountInvite[] = mapFilter(
      values(
        mapValues(groupBy(userInvites, 'accountId'), first)
      ),
      identity
    )

    const results = await mapAsyncTry<AccountInvite, { accountId: number }>(uniqueByAccountInvites, bind(this.joinRegisteredUserToAccount, this, _, userId))

    return {
      accountIds: mapFilter(results, r => 'accountId' in r ? r.accountId : null)
    }
  }

  private async sendEmailInviteToEmail(email: string, account: Account, invite: AccountInvite) {
    await this.emailService.sendInviteToEmail(email, account, invite)
  }

  private async sendSmsInviteToPhone(rawPhone: string, account: Account, invite: AccountInvite) {
    const phone = formatPhoneNumber(rawPhone)

    if (!phone)
      throw new Error(`Phone number = "${rawPhone}" cannot be formatted`)

    await this.smsService.sendInviteToAccountSms(phone, account, invite)
  }

  private async sendEmailInviteToRegisteredUser(userId: number, account: Account, invite: AccountInvite) {
    const contacts = await this.prisma.userContact.findMany({
      where: {
        userId,
        OR: [{ type: 'email' }, { type: 'phone' }]
      }
    })

    const emails = contacts.filter(({ type }) => type === 'email').map(({ email }) => email)
    const phones = contacts.filter(({ type }) => type === 'phone').map(({ phone }) => phone)

    await Promise.all([
      mapAsyncTry(emails, bind(this.sendEmailInviteToEmail, this, _, account, invite)),
      mapAsyncTry(phones, bind(this.sendSmsInviteToPhone, this, _, account, invite))
    ])
  }
}
