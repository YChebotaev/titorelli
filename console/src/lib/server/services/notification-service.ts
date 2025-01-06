import { mapFilterAsync } from "@/lib/utils";
import { prismaClient } from "../prisma-client";
import { getAccountService, getEmailService, getFlashMessageService, getSmsService } from "./instances";

export class NotificationService {
  private prisma = prismaClient

  get emailService() {
    return getEmailService()
  }

  get smsService() {
    return getSmsService()
  }

  get flashMessageService() {
    return getFlashMessageService()
  }

  get accountService() {
    return getAccountService()
  }

  async accountCreated(userId: number, accountId: number) {
    throw new Error('NotificationService#accountCreated not implemeted yet')
  }

  async youInvitedToAccount(userId: number, accountId: number) {
    throw new Error('NotificationService#youInvitedToAccount not implemeted yet')
  }

  async accountDeletionRequested(userId: number, accountId: number) {
    throw new Error('NotificationService#accountDeletionRequested not implemeted yet')
  }

  async accountDeletionCompleted(accountOwnerId: number, memberIds: number[], accountId: number) {
    throw new Error('NotificationService#accountDeletionCompleted not implemeted yet')
  }

  async yourAccessRightChangedInAccount(userId: number, accountId: number) {
    throw new Error('NotificationService#yourAccessRightChangedInAccount not implemeted yet')
  }

  async emailConfirmationRequested(userId: number, userContactId: number) {
    throw new Error('NotificationService#emailConfirmationRequested not implemeted yet')
  }

  async phoneConfirmationRequested(userId: number, userContactId: number) {
    throw new Error('NotificationService#phoneConfirmationRequested not implemeted yet')
  }

  async emailRemoved(userId: number, userContactId: number) {
    throw new Error('NotificationService#emailRemoved not implemeted yet')
  }

  async phoneRemoved(userId: number, userContactId: number) {
    throw new Error('NotificationService#phoneRemoved not implemeted yet')
  }

  async passwordResetRequested(userId: number) {
    throw new Error('NotificationService#passwordResetRequested not implemeted yet')
  }

  async accountsJoinOnRegistration(userId: number, accountIds: number[]) {
    const accounts = await mapFilterAsync(accountIds, this.accountService.getAccount.bind(this.accountService))

    await this.flashMessageService.pushAccountJoinNotificationToUser(userId, accounts)
  }
}
