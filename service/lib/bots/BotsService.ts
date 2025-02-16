import { type Logger } from "pino";
import { Db } from "../Db";
import { DockhostService } from "./dockhost";

export type BotRecord = {
  id: number
  accountId: number
  tgBotToken?: string
  dockhostImage?: string
  dockhostContainer?: string
  dockhostProject?: string
  state: string
  scopes: string
}

export class BotsService {
  private dockhost: DockhostService
  private db: Db
  private siteOrigin = process.env.SITE_ORIGIN
  private cryptoPepper = process.env.BOTS_CRYPTO_PEPPER
  private baseDockhostProject: string
  private baseDockhostContainer: string
  private baseDockhostImage: string
  private logger: Logger

  constructor({
    dockhostToken,
    dbFilename,
    baseDockhostProject,
    baseDockhostContainer,
    baseDockhostImage,
    logger
  }: {
    dockhostToken: string
    dbFilename: string
    baseDockhostProject: string
    baseDockhostContainer: string
    baseDockhostImage: string
    logger: Logger
  }) {
    this.baseDockhostProject = baseDockhostProject
    this.baseDockhostContainer = baseDockhostContainer
    this.baseDockhostImage = baseDockhostImage
    this.dockhost = new DockhostService(dockhostToken)
    this.db = new Db(dbFilename)
    this.logger = logger
  }

  public async syncState(botId: number) {
    const bot = await this.db.knex
      .select('*')
      .from('ManagedBot')
      .where('id', botId)
      .first<BotRecord>()

    if (!bot)
      return null

    if (bot.dockhostContainer == null) {
      await this.spawn(bot)
    }
  }

  public async assertIdentity(clientId: string, clientSecret: string, scopes: string[])
    : Promise<[false] | [true, string[]]> {
    const [botId, accountId] = this.unmaskClientId(clientId)

    if (!botId == null || accountId == null)
      return [false]

    const bot = await this.db.knex
      .select('*')
      .from('ManagedBot')
      .where('id', botId)
      .where('accountId', accountId)
      .first<BotRecord>()

    if (!bot)
      return [false]

    const accessToken = await this.getBotAccessToken(bot.id)

    if (accessToken !== clientSecret)
      return [false]

    const botScopes = bot.scopes.trim().split(/\s+/).map(s => s.trim()).filter(Boolean)
    const grantedScopes = scopes.filter(scope => botScopes.includes(scope))

    return [true, grantedScopes]
  }

  private async spawn(bot: BotRecord) {
    const accessToken = await this.getBotAccessToken(bot.id)

    if (accessToken == null)
      return null

    if (bot.tgBotToken == null)
      return null

    await this.dockhost.createContainer({
      name: `titus-${bot.id}`,
      image: 'ghcr.io/ychebotaev/titus-bot',
      variable: {
        TITORELLI_CLIENT_ID: this.maskClientId(bot.id, bot.accountId),
        ACCESS_TOKEN: accessToken,
        TITORELLI_HOST: this.siteOrigin,
        BOT_TOKEN: bot.tgBotToken,
      }
    })
  }

  public maskClientId(botId: number, accountId: number) {
    return btoa(`${btoa(String(botId))}:${btoa(String(accountId))}`)
  }

  public unmaskClientId(maskedClientId: string): [number, number] | null {
    try {
      return atob(maskedClientId).split(':').map((s) => atob(s)).map(Number) as [number, number]
    } catch (e) {
      this.logger.error(e)

      return null
    }
  }

  private async getBotAccessToken(botId: number) {
    const result = await this.db.knex
      .select('AccessToken.token')
      .join('ManagedBot', 'AccessToken.id', 'ManagedBot.accessTokenId')
      .where('ManagedBot.id', botId)
      .from('AccessToken')
      .first<{ token: string }>()

    if (result != null && 'token' in result) {
      return result.token
    }

    return null
  }
}
