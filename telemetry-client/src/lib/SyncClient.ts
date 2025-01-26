import { Db } from "./Db";
import { SyncMetadataRepository } from "./repositories/SyncMetadata";

export type SyncEndpointResult = {
  lastReceivedId: number
}

export type StartEndpointResult = {
  transactionId: number
}

export class SyncClient {
  private syncMetadataRepository: SyncMetadataRepository
  private _inProgress: boolean
  private tableNames = [
    'chatInfo',
    'memberInfo',
    'messageInfo',
    'predictions',
    'selfInfo'
  ]

  constructor(
    private _getServiceUrl: () => string,
    private _getClientId: () => string,
    private _db: Db
  ) {
    this._inProgress = false
    this.syncMetadataRepository = new SyncMetadataRepository(this._db)
  }

  get inProgress() {
    return this._inProgress
  }

  async push() {
    const tId = await this.beginTransaction()

    try {
      for (const tableName of this.tableNames) {
        const startId = await this.syncMetadataRepository.getLastReceivedIdByTableName(tableName)
        const data = await this._db.selectFromTableNameFromId(tableName, startId)

        const resp = await fetch(this._getServiceUrl() + '/telemetry/' + this._getClientId() + '/sync', {
          method: 'POST',
          body: JSON.stringify({
            table: tableName,
            data,
            transactionId: tId
          }),
          headers: { 'Content-Type': 'application/json' }
        })

        if (resp.ok) {
          const { lastReceivedId } = await resp.json() as Awaited<SyncEndpointResult>

          await this.syncMetadataRepository.updateLastReceivedIdByTableName(tId, tableName, lastReceivedId)
        }
      }
    } catch (e) {
      await this.abortTransaction(tId)
    } finally {
      await this.endTransaction(tId)
    }
  }

  private async beginTransaction() {
    const resp = await fetch(
      this._getServiceUrl() + '/telemetry/' + this._getClientId() + '/sync/begin',
      { method: 'POST' }
    )

    if (resp.ok) {
      const data = await resp.json() as Awaited<StartEndpointResult>

      return data.transactionId
    }

    return null
  }

  private async abortTransaction(tId: number) {
    await fetch(
      this._getServiceUrl() + '/telemetry/' + this._getClientId() + '/sync/abort',
      {
        method: 'POST',
        body: JSON.stringify({ transactionId: tId }),
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }

  private async endTransaction(tId: number) {
    await fetch(
      this._getServiceUrl() + '/telemetry/' + this._getClientId() + '/sync/complete',
      {
        method: 'POST',
        body: JSON.stringify({ transactionId: tId }),
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
