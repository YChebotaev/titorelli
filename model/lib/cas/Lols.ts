import type { Logger } from 'pino'
import type { ICas } from './types'

export type LolsAccountRespData = {
  ok: boolean
  user_id: number
  banned: boolean
}

export class LolsAntispam implements ICas {
  constructor(
    private logger: Logger
  ) {
  }

  async has(tgUserId: number): Promise<boolean> {
    const url = new URL('/account', 'https://api.lols.bot')
    url.searchParams.set('id', String(tgUserId))

    const resp = await fetch(url)

    const data = await resp.json() as Awaited<LolsAccountRespData>

    if (data.ok) {
      return data.banned
    }

    return false
  }

  async add(id: number): Promise<void> {
    // Not implemented yet
  }
}
