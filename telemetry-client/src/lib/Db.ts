import createKnex from 'knex'

export class Db {
  private _knex: ReturnType<typeof createKnex>

  constructor(private _dbFilename: string) {
    this._knex = createKnex({
      client: 'sqlite3',
      connection: { filename: this._dbFilename },
      useNullAsDefault: true,
    })
  }

  get dbFilename() {
    return this._dbFilename
  }

  get knex() {
    return this._knex
  }

  async selectFromTableNameFromId(tableName: string, startId: number): Promise<Record<string, unknown>[]> {
    const records = await this._knex
      .select('*')
      .from(tableName)
      .where('id', '>', startId)

    return records
  }
}
