import { JsonObject } from "@prisma/client/runtime/library";
import { maskNumber } from "../keymask";
import { prismaClient } from "../prisma-client";

export type ActionIds = 'noop'
export type NotificationTypes =
  | 'default'
  | 'description'
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | `action/${ActionIds}`
export type NotificationPositions =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
export type UserNotificationPayloadType =
  | { message?: string, description?: string, position?: NotificationPositions }
  | JsonObject

export class FlashMessageService {
  private prisma = prismaClient

  async pushAccountJoinNotificationToUser(userId: number, accountNames: { name: string }[]) {
    if (accountNames.length === 0) {
      // Do nothing
    } else
      if (accountNames.length === 1) {
        await this.pushNotificationToUser(userId, 'success', {
          message: `Вы присоединились к аккаунту "${accountNames[0].name}"`
        })
      } else
        if (accountNames.length > 1) {
          await this.pushNotificationToUser(userId, 'success', {
            message: `Вы успешно присоединились к аккаунтам: ${accountNames.map(({ name }) => name).join(', ')}`
          })
        }
  }

  async getUnreceivedUserNotifications(userId: number) {
    const notifications = await this.prisma.flashMessage.findMany({
      where: {
        channel: `user/${maskNumber(userId)}`,
        kind: 'notification',
        received: false
      }
    })

    return notifications
  }

  async markReceivedUserNotifications(ids: number[]) {
    await this.prisma.flashMessage.updateMany({
      where: { id: { in: ids } },
      data: {
        received: true
      }
    })
  }

  private async pushNotificationToUser(
    userId: number,
    notificationType: NotificationTypes = 'default',
    payload?: UserNotificationPayloadType
  ) {
    await this.prisma.flashMessage.create({
      data: {
        kind: 'notification',
        channel: `user/${maskNumber(userId)}`,
        notificationType,
        payload: payload != null ? JSON.stringify(payload) : undefined
      }
    })
  }

  performAction(id: ActionIds, payload: JsonObject) {
    switch (id) {
      case 'noop':
        return this.performNoopAction(payload)
    }
  }

  private performNoopAction(payload: JsonObject) {
    console.log('noop action invoked with payload =', payload)
  }
}
