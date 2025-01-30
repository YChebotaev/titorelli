import { type TitorelliClient } from "@titorelli/client"
import { type Logger } from "pino"

export type BotCoreConfig = {
  titorelli: TitorelliClient
  logger: Logger
  deleteMessage(tgMessageId: number): Promise<void>
  banChatMember(tgUserId: number): Promise<void>
  getTextContent<M>(m: M): string | Promise<string>
  getTgFromId<M>(m: M): number | Promise<number>
  getTgMessageId<M>(m: M): number | Promise<number>
}

export class BotCore<CoreM> {
  private titorelli: TitorelliClient
  private logger: Logger
  // @ts-expect-error TS2391
  private deleteMessage(tgMessageId: number): Promise<void>
  // @ts-expect-error TS2391
  private banChatMember(tgMessageId: number): Promise<void>
  // @ts-expect-error TS2391
  private getTextContent<M = CoreM>(m: M): string | Promise<string>
  // @ts-expect-error TS2391
  private getTgFromId<M = CoreM>(m: M): number | Promise<number>
  // @ts-expect-error TS2391
  private getTgMessageId<M = CoreM>(m: M): number | Promise<number>

  constructor({
    titorelli,
    logger,
    deleteMessage,
    banChatMember,
    getTextContent,
    getTgFromId: getTgUserId,
    getTgMessageId
  }: BotCoreConfig) {
    this.titorelli = titorelli
    this.logger = logger
    this.deleteMessage = deleteMessage
    this.banChatMember = banChatMember
    this.getTextContent = getTextContent
    this.getTgFromId = getTgUserId
    this.getTgMessageId = getTgMessageId
  }

  async messageHandler(m: CoreM) {
    const text = await this.getTextContent(m)
    const tgFromId = await this.getTgFromId(m)
    const tgMessageId = await this.getTgMessageId(m)

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
      await this.deleteMessage(tgMessageId)
      await this.banChatMember(tgFromId)

      this.logger.info('User banned and message deleted because of CAS ban: %s', text)

      return
    }

    if (reason === 'duplicate' && label === 'spam') {
      await this.deleteMessage(tgMessageId)

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
          await this.deleteMessage(tgMessageId)

          this.logger.info('Message deleted because classified as spam: %s', text)

          return
        }
    }
  }
}
