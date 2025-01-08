import { UserNotification } from "@prisma/client";
import { prismaClient } from "../prisma-client";

export type UserNotificationTypes =
  | 'generic-toast'
  | 'join-to-accounts'

export type GenericToasPayload = {
  type: "default" | 'success' | 'info' | 'warning' | 'error',
  message: string,
  description?: string
}

export type JoinToAccountsPayload = { accounts: { name: string }[] }

export type UserNotificationPayloads =
  | GenericToasPayload
  | JoinToAccountsPayload

export class UserNotificationService {
  private prisma = prismaClient

  // #region Domain methods

  async accountsJoin(userId: number, accounts: { name: string }[]) {
    if (accounts.length) {
      await this.pushNotification(userId, 'join-to-accounts', { accounts })
    }
  }

  async verificationEmailSent(userId: number, email: string) {
    await this.pushGenericToast(userId, {
      type: 'default',
      message: `Требуется подтверждение email-а`,
      description: `Запрос на подтверждение отправлен на почту: ${email}`
    })
  }

  // #endregion

  // #region Generic methods

  async pushGenericToast(userId: number, payload: GenericToasPayload) {
    await this.pushNotification(userId, 'generic-toast', payload)
  }

  async getUnreceivedUserFlashNotifications(userId: number) {
    const notifications = await this.prisma.userNotification.findMany({
      where: {
        userId,
        received: false,
        flash: true
      }
    })

    return notifications
  }

  async getPaginatedNotifications(userId: number, page: number, size: number): Promise<[UserNotification[], number]> {
    return this.prisma.$transaction([
      this.prisma.userNotification.findMany({
        where: { userId },
        skip: page * size,
        take: size
      }),
      this.prisma.userNotification.count({
        where: { userId }
      })
    ])
  }

  async markReceivedUserNotifications(ids: number[]) {
    await this.prisma.userNotification.updateMany({
      where: { id: { in: ids } },
      data: {
        received: true
      }
    })
  }

  private async pushNotification(userId: number, type: UserNotificationTypes, payload: UserNotificationPayloads, flash = true) {
    await this.prisma.userNotification.create({
      data: {
        flash,
        userId,
        type,
        payload: JSON.stringify(payload)
      }
    })
  }

  // #endregion
}
