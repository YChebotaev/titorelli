import { Knex } from "knex";
import { omit } from 'lodash'
import type { Db } from "../Db";
import type { SelfInfoRecord, SelfInfo } from "../types";

export class SelfInfoRepository {
  constructor(private db: Db) { }

  private get knex() {
    return this.db.knex as Knex<SelfInfoRecord, SelfInfoRecord[]>
  }

  async insertIfChanged(selfInfo: SelfInfo) {
    const lastValue = await this.knex
      .select('id')
      .from('selfInfo')
      .where('tgUserId', selfInfo.id)
      .andWhere('firstName', selfInfo.firstName)
      .andWhere('lastName', selfInfo.lastName)
      .andWhere('username', selfInfo.username)
      .andWhere('languageCode', selfInfo.languageCode)
      .andWhere('isPremium', selfInfo.isPremium)
      .andWhere('addedToAttachmentMenu', selfInfo.addedToAttachmentMenu)
      .andWhere('isBot', selfInfo.isBot)
      .andWhere('canJoinGroups', selfInfo.canJoinGroups)
      .andWhere('canReadAllGroupMessages', selfInfo.canReadAllGroupMessages)
      .andWhere('supportsInlineQueries', selfInfo.supportsInlineQueries)
      .first()

    if (!lastValue) {
      await this.knex
        .insert(omit(selfInfo, 'id'))
        .into('selfInfo')
    }
  }
}
