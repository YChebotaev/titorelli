import path from 'node:path'
import createKnex from 'knex'

export class Db {
  private _knex: ReturnType<typeof createKnex>

  constructor(
    private _dbFilename: string,
    private _migrationsDir: string
  ) {
    this._knex = createKnex({
      client: 'sqlite3',
      connection: { filename: this._dbFilename },
      useNullAsDefault: true,
    })

    this.initialize()
  }

  get knex() {
    return this._knex
  }

  private async initialize() {
    await this._knex.migrate.latest({
      directory: this._migrationsDir
    })
  }
}
