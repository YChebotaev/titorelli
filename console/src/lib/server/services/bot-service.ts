import { inspect } from 'node:util'

import slugify from "@sindresorhus/slugify";
import { prismaClient } from "../prisma-client";

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

  public async start(botId: number) { }

  public async stop(botId: number) { }

  public async abort(botId: number) { }

  public async restart(botId: number) { }

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
