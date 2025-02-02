import path from 'node:path'
import EventEmitter from 'node:events'
import { Db } from "../Db"
import { SelfInfoRepository } from './repositories/SelfInfoRepository'
import { MemberInfoRepository } from './repositories/MemberInfoRepository'
import { ChatInfoRepository } from './repositories/ChatInfoRepository'
import { MessageInfoRepository } from './repositories/MessageInfoRepository'
import { PredictionsRepository } from './repositories/PredictionsRepository'
import type { SelfInfo, UserInfo, ChatInfo, MessageInfo, MemberInfoRecord } from "./types"

export declare interface TelemetryServer {
  on(event: 'track:bot', listener: (data: SelfInfo) => void): this;
  on(event: 'track:member', listener: (data: UserInfo) => void): this;
  on(event: 'track:chat', listener: (data: ChatInfo) => void): this;
  on(event: 'track:message', listener: (data: MessageInfo) => void): this;
  on(
    event: 'track:prediction',
    listener: (data: {
      tgMessageId: number,
      fromTgUserId: number,
      label: 'spam' | 'ham',
      reason: string,
      confidence: string
    }) => void
  ): this;
}

export class TelemetryServer extends EventEmitter {
  private db = new Db(
    process.env.TELEMETRY_DB_FILENAME ?? path.join(process.cwd(), 'telemetry.sqlite3'),
    path.join(__dirname, './migrations')
  )
  private selfInfoRepository = new SelfInfoRepository(this.db)
  private memberInfoRepository = new MemberInfoRepository(this.db)
  private chatInfoRepository = new ChatInfoRepository(this.db)
  private messageInfoRepository = new MessageInfoRepository(this.db)
  private predictionsRepository = new PredictionsRepository(this.db)

  async trackSelfBotInfo(botInfo: SelfInfo) {
    await this.selfInfoRepository.insertIfChanged(botInfo)

    this.emit('track:bot', botInfo)
  }

  async trackMemberInfo(userInfo: UserInfo) {
    await this.memberInfoRepository.insertIfChanged(userInfo)

    this.emit('track:member', userInfo)
  }

  async trackChat(chatInfo: ChatInfo) {
    await this.chatInfoRepository.insertIfChanged(chatInfo)

    this.emit('track:chat', chatInfo)
  }

  async trackMessage(messageInfo: MessageInfo) {
    await this.messageInfoRepository.insert(messageInfo)

    this.emit('track:message', messageInfo)
  }

  async trackPrediction(tgMessageId: number, prediction: any, reporterTgBotId: number) {
    const savedMessage = await this.messageInfoRepository.getByTgMessageId(tgMessageId)

    if (savedMessage) {
      await this.predictionsRepository.insert(tgMessageId, savedMessage.fromTgUserId, prediction, reporterTgBotId)
    }

    this.emit('track:prediction', {
      tgMessageId,
      fromTgUserId: savedMessage.fromTgUserId,
      ...prediction
    })
  }
}
