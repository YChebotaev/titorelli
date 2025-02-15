import slugify from "@sindresorhus/slugify";
import { prismaClient } from "../prisma-client";
import { BotState } from '@/types/bot';

export class BotService {
  private prisma = prismaClient

  public async list(accountId: number) {
    return this.prisma.managedBot.findMany({
      where: { accountId }
    })
  }

  public async create(accountId: number, {
    name,
    description,
    bypassTelemetry,
    modelId,
    accessTokenId,
    tgBotToken
  }: {
    name: string
    description: string
    bypassTelemetry: boolean
    modelId: number | null
    accessTokenId: number | null
    tgBotToken: string
  }) {
    if (modelId == null || accessTokenId == null)
      return null

    const user = await this.tgGetMe(tgBotToken)

    if (!user)
      return null

    await this.prisma.managedBot.create({
      data: {
        name,
        code: slugify(name),
        description,
        bypassTelemetry,
        state: 'created',
        accountId,
        accessTokenId,
        modelId,
        tgUsername: user.username,
        tgFirstName: user.firstName,
        tgLastName: '',
        tgUserId: user.id,
        canJoinGroups: user.canJoinGroups,
        canReadAllGroupMessages: user.canReadAllGroupMessages,
        supportsInlineQueries: user.supportsInlineQueries,
        tgBotToken
      }
    })
  }

  public async changeState(botId: number, newState: BotState) {
    const bot = await this.prisma.managedBot.findFirst({
      where: { id: botId }
    })

    if (!bot)
      return null

    if (['created', 'starting', 'stopping', 'failed'].includes(newState))
      return null

    switch (`${bot.state}/${newState}`) {
      case 'starting/stopped':
        return this.abort(botId)
      case "created/running":
        return this.start(botId)
      case "stopped/running":
        return this.start(botId)
      case "failed/running":
        return this.restart(botId)
      case "running/stopped":
        return this.stop(botId)
      default:
        return null
    }
  }

  public async getBotState(botId: number) {
    const bot = await this.prisma.managedBot.findFirst({
      where: { id: botId }
    })

    return (bot?.state as BotState | undefined) ?? null
  }

  private async start(botId: number) {
    await this.prisma.managedBot.update({
      where: { id: botId },
      data: { state: 'starting' }
    })
  }

  private async stop(botId: number) {
    await this.prisma.managedBot.update({
      where: { id: botId },
      data: { state: 'stopping' }
    })
  }

  private async abort(botId: number) {
    await this.prisma.managedBot.update({
      where: { id: botId },
      data: { state: 'stopping' }
    })
  }

  private async restart(botId: number) {
    await this.prisma.managedBot.update({
      where: { id: botId },
      data: { state: 'starting' }
    })
  }

  private async tgGetMe(botToken: string) {
    try {
      const resp = await fetch(
        `https://api.telegram.org/bot${botToken}/getMe`,
      );
      const userData = (await resp.json()) as
        | { ok: false }
        | { ok: true, result: { can_join_groups: boolean, can_read_all_group_messages: boolean, first_name: string, id: number, username: string, supports_inline_queries: boolean } };

      if (userData.ok) {
        return {
          canJoinGroups: userData.result.can_join_groups,
          canReadAllGroupMessages: userData.result.can_read_all_group_messages,
          firstName: userData.result.first_name,
          id: userData.result.id,
          username: userData.result.username,
          supportsInlineQueries: userData.result.supports_inline_queries
        }
      }

      return null
    } catch (_e) {
      console.warn(_e)

      return null
    }
  }
}
