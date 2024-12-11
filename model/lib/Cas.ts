import fs from 'node:fs'
import { finished } from 'node:stream/promises'
import { parse } from 'csv'
import { ICas } from './types'

export class CasAntispam implements ICas {
  private records = new Set<number>
  private ready: Promise<void>

  constructor(
    private modelFilename
  ) {
    this.ready = this.initialize()
  }

  async has(tgUserId: number) {
    await this.ready

    return this.records.has(tgUserId)
  }

  private async initialize() {
    this.records.clear()

    const parser = fs
      .createReadStream(this.modelFilename)
      .pipe(parse())

    parser.on('readable', () => {
      let record: [string]

      while ((record = parser.read()) != null) {
        this.records.add(Number(record[0]))
      }
    })

    await finished(parser)
  }
}
