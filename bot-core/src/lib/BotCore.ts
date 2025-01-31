import { type TitorelliClient } from "@titorelli/client"
import { type Logger } from "pino"

export type BotCoreConfig = {
  titorelli: TitorelliClient
  logger: Logger
}

export abstract class BotCore<Ctx> {
  protected titorelli: TitorelliClient
  protected logger: Logger

  protected abstract getTgChatId(ctx: Ctx): Promise<number>
  protected abstract getTextContent(ctx: Ctx): string | Promise<string>
  protected abstract getTgFromUserId(ctx: Ctx): number | Promise<number>
  protected abstract getTgMessageId(ctx: Ctx): number | Promise<number>
  protected abstract deleteMessage(tgChatId: number, tgMessageId: number): Promise<any>
  protected abstract banChatMember(tgChatId: number, tgMessageId: number): Promise<any>

  constructor({
    titorelli,
    logger
  }: BotCoreConfig) {
    this.titorelli = titorelli
    this.logger = logger
  }

  async messageHandler(ctx: Ctx) {
    const tgChatId = await this.getTgChatId(ctx)
    const text = await this.getTextContent(ctx)
    const tgFromId = await this.getTgFromUserId(ctx)
    const tgMessageId = await this.getTgMessageId(ctx)

    const {
      value: label,
      reason
    } = await this.titorelli.predict({
      text,
      tgUserId: tgFromId
    })

    await this.titorelli.duplicate.train({ text, label })

    if (reason === 'totem') {
      this.logger.info('User has totem for message: %s', text)

      return
    }

    if (reason === 'cas') {
      await this.deleteMessage(tgChatId, tgMessageId)
      await this.banChatMember(tgChatId, tgFromId)

      this.logger.info('User banned and message deleted because of CAS ban: %s', text)

      return
    }

    if (reason === 'duplicate' && label === 'spam') {
      await this.deleteMessage(tgChatId, tgMessageId)

      this.logger.info('Message deleted because it known spam duplicate: %s', text)

      return
    }

    if (reason === 'classifier') {
      if (label === 'ham') {
        await this.titorelli.totems.train({ tgUserId: tgFromId })

        this.logger.info('User grated totem because message classified as ham: %s', text)

        return
      } else
        if (label === 'spam') {
          await this.deleteMessage(tgChatId, tgMessageId)

          this.logger.info('Message deleted because classified as spam: %s', text)

          return
        }
    }
  }
}
