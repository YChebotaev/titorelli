import path from 'node:path'
import { Db } from "../Db";
import { DockhostService } from "../dockhost/DockhostService";

export type ManagedBotRecord = {
  id: number
  accountId: number
  name: string
  tgBotToken: string
  createdAt: string
  updatedAt: string
}

export class BotsService {
  private dockhost = new DockhostService(process.env.DOCKHOST_TOKEN)
  private db = new Db(
    path.join(__dirname, '../../console/prisma/dev.db')
  )

  public async spawn(id: number) {
    const bot = await this.db.knex
      .select('*')
      .from('ManagedBot')
      .where('id', id)
      .first<ManagedBotRecord>()

    if (!bot)
      return null

    await this.dockhost.createContainer({
      name: `titorelli-bot-${id}`,
      image: 'ghcr.io/ychebotaev/titorelli-bot',
      cpuFraction: 5
    })

    await this.dockhost.startContainer('react-ru-bot', `titorelli-bot-${id}`)
  }
}
