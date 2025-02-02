import axios from 'axios'
import { env } from '../env'
import { prismaClient } from '../prisma-client'
import { uniqBy } from 'lodash'
import { DMChat } from '@/types/data-markup'

export class DataMarkupService {
  private prisma = prismaClient
  private axios = axios.create({ baseURL: env.TITORELLI_HOST })

  async getChats(accountId: number) {
    const accountWithBotInstances = await this.prisma.account.findFirst({
      where: { id: accountId },
      include: {
        bots: {
          include: {
            instances: true
          }
        }
      }
    })

    if (!accountWithBotInstances)
      return []

    const tgBotIds = accountWithBotInstances.bots
      .flatMap(({ instances }) => instances.map(({ tgBotId }) => tgBotId))

    const chats = uniqBy(
      (
        await Promise.all(
          tgBotIds.map(tgBotId => this.getBotChats(tgBotId))
        )
      ).flat(),
      (({ id }) => id)
    )

    return chats
  }

  private async getBotChats(tgBotId: number) {
    const { data } = await this.axios.get<DMChat[]>('/markup/chats', { params: { tgBotId } })

    return data
  }
}
