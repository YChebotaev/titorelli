import { Knex } from "knex";
import type { Db } from "../Db";
import type { ChatInfo, ChatInfoRecord } from "../types";

export class ChatInfoRepository {
  constructor(private db: Db) { }

  private get knex() {
    return this.db.knex as Knex<ChatInfoRecord, ChatInfoRecord[]>
  }

  async insertIfChanged(chatInfo: ChatInfo) {
    const lastValue = await this.knex
      .select('id')
      .from('chatInfo')
      .where('tgChatId', chatInfo.id)
      .andWhere('type', chatInfo.type)
      .andWhere('username', chatInfo.username)
      .andWhere('title', chatInfo.title)
      .andWhere('firstName', chatInfo.firstName)
      .andWhere('lastName', chatInfo.lastName)
      .andWhere('isForum', chatInfo.isForum)
      .andWhere('description', chatInfo.description)
      .andWhere('bio', chatInfo.bio)
      .first()

    if (!lastValue) {
      await this.knex
        .insert(chatInfo)
        .into('chatInfo')
    }
  }
}
