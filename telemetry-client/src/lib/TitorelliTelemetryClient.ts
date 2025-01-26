import path from 'node:path'
import { Prediction } from '@titorelli/client'
import { Db } from "./Db"
import { SelfInfoRepository } from './repositories/SelfInfoRepository'
import { MemberInfoRepository } from './repositories/MemberInfoRepository'
import { ChatInfoRepository } from './repositories/ChatInfoRepository'
import { MessageInfoRepository } from './repositories/MessageInfoRepository'
import { PredictionsRepository } from './repositories/PredictionsRepository'
import type { SelfInfo, UserInfo, ChatInfo, MessageInfo } from "./types"
import { SyncClient } from './SyncClient'

export type TitorelliTelemetryClientConfig = {
  serviceUrl: string
  clientId: string
  bypassToken?: string
}

export class TitorelliTelemetryClient {
  private serviceUrl: string
  private clientId: string
  private bypassToken?: string
  private db = new Db(process.env.DB_FILENAME ?? path.join(process.cwd(), 'db.sqlite3'))
  private sync = new SyncClient(
    () => this.serviceUrl,
    () => this.clientId,
    this.db
  )
  private syncTimeout: NodeJS.Timeout
  private selfInfoRepository = new SelfInfoRepository(this.db)
  private memberInfoRepository = new MemberInfoRepository(this.db)
  private chatInfoRepository = new ChatInfoRepository(this.db)
  private messageInfoRepository = new MessageInfoRepository(this.db)
  private predictionsRepository = new PredictionsRepository(this.db)

  constructor({ serviceUrl, clientId, bypassToken }: TitorelliTelemetryClientConfig) {
    this.serviceUrl = serviceUrl
    this.clientId = clientId
    this.bypassToken = bypassToken
    this.syncTimeout = setTimeout(this.syncHandler, 10 * 60 * 1000)
  }

  async trackSelfBotInfo(botInfo: SelfInfo) {
    await this.selfInfoRepository.insertIfChanged(botInfo)
  }

  async trackMemberInfo(userInfo: UserInfo) {
    await this.memberInfoRepository.insertIfChanged(userInfo)
  }

  async trackChat(chatInfo: ChatInfo) {
    await this.chatInfoRepository.insertIfChanged(chatInfo)
  }

  async trackMessage(messageInfo: MessageInfo) {
    await this.messageInfoRepository.insert(messageInfo)
  }

  async trackPrediction(tgMessageId: number, prediction: Prediction) {
    const savedMessage = await this.messageInfoRepository.getByTgMessageId(tgMessageId)

    if (savedMessage) {
      await this.predictionsRepository.insert(tgMessageId, savedMessage.fromTgUserId, prediction)
    }
  }

  private async syncHandler() {
    clearTimeout(this.syncTimeout)

    if (this.sync.inProgress)
      return

    await this.sync.push()

    this.syncTimeout = setTimeout(this.syncHandler, 10 * 60 * 1000)
  }
}
