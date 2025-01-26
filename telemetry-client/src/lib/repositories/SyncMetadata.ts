import { Knex } from "knex";
import type { Db } from "../Db";
import type { SyncMetadataRecord } from "../types";

export class SyncMetadataRepository {
  constructor(private db: Db) { }

  private get knex() {
    return this.db.knex as Knex<SyncMetadataRecord, SyncMetadataRecord[]>
  }

  async getLastReceivedIdByTableName(tableName: string): Promise<number> {
    const r = await this.knex
      .select('lastReceivedId')
      .from('syncMetadata')
      .where('tableName', tableName)
      .first<Pick<SyncMetadataRecord, 'lastReceivedId'>>()

    if (r == null)
      return 0

    return r.lastReceivedId
  }

  async updateLastReceivedIdByTableName(transactionId: number, tableName: string, lastReceivedId: number) {
    await this.knex
      .insert({ lastReceivedId, transactionId })
      .where('tableName', tableName)
  }
}
