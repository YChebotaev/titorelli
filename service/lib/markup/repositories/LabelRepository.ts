import { type Knex } from 'knex'
import type { Db } from "../../Db";
import type { LabelRecord } from "../types";

export class LabelRepository {
  constructor(private db: Db) { }

  private get knex() {
    return this.db.knex as Knex<LabelRecord, LabelRecord[]>
  }

  async insert(data: Omit<LabelRecord, 'id' | 'createdAt' | 'updatedAt'>) {
    await this.knex
      .insert({
        ...data,
        createdAt: new Date().toISOString()
      })
      .into('labels')
  }

  async listByMessageIdAndAuthor(tgMessageId: number, author: string) {
    return this.knex
      .select<LabelRecord[]>('*')
      .from('labels')
      .where('tgMessageId', tgMessageId)
      .andWhere('author', author)
  }
}
