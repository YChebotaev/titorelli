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
  state: "created" | "starting" | "running" | "stopping" | "stopped" | "failed"
  scopes: string
}

export class BotsService {
  private dockhost: DockhostService
  private db: Db
  private siteOrigin = process.env.SITE_ORIGIN
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
    logger,
    siteOrigin
  }: {
    dockhostToken: string
    dbFilename: string
    baseDockhostProject: string
    baseDockhostContainer: string
    baseDockhostImage: string
    logger: Logger
    siteOrigin?: string
  }) {
    this.baseDockhostProject = baseDockhostProject
    this.baseDockhostContainer = baseDockhostContainer
    this.baseDockhostImage = baseDockhostImage
    this.dockhost = new DockhostService(dockhostToken)
    this.db = new Db(dbFilename)
    this.logger = logger

    if (siteOrigin != null) {
      this.siteOrigin = siteOrigin
    }
  }

  public async convergeFor(botId: number) {
    const bot = await this.db.knex
      .select('*')
      .from('ManagedBot')
      .where('id', botId)
      .first<BotRecord>()

    if (!bot)
      return false

    if (await this.shouldCreateContainer(bot)) {
      const [created, updated] = await this.createContainerFor(bot)

      if (!created)
        return false

      await this.db.knex('ManagedBot')
        .update({ ...updated, state: 'created' })
        .where('id', bot.id)

      return true
    } else {
      return this.pushState(bot)
    }
  }

  private async pushState(bot: BotRecord) {
    const { state: botState } = bot
    const containerStatus = await this.getContainerStatusFor(bot)
    const fullState = `${botState}/${containerStatus}` as `${typeof botState}/${typeof containerStatus}`

    console.log('fullState =', fullState)

    switch (fullState) {
      case 'created/creating':
        return
      case "created/stopped":
        // Нормальное состояние, если контейнер создан
        // без реплик (а он создан без реплик),
        // то это нормально, что он вначале остановлен
        return this.startContainerFor(bot)
      case "created/updating":
        return
      case "created/ready":
      case "created/paused":
      case "starting/stopped":
      case "starting/creating":
      case "starting/updating":
      case "starting/ready":
      case "starting/paused":
      case "running/stopped":
      case "running/creating":
      case "running/updating":
      case "running/ready":
      case "running/paused":
      case "stopping/stopped":
      case "stopping/creating":
      case "stopping/updating":
      case "stopping/ready":
      case "stopping/paused":
      case "stopped/stopped":
      case "stopped/creating":
      case "stopped/updating":
      case "stopped/ready":
      case "stopped/paused":
      case "failed/stopped":
      case "failed/creating":
      case "failed/updating":
      case "failed/ready":
      case "failed/paused":
      default: return
    }
  }

  private async containerMayBeFailedFor(bot: BotRecord) { }

  private async startContainerFor(bot: BotRecord) {
    console.log('startContainerFor')

    const result = await this.dockhost.scaleContainer(bot.dockhostContainer, 1, bot.dockhostProject)

    console.log('result =', result)
  }

  private async shouldCreateContainer(bot: BotRecord) {
    return !(await this.hasContainerInDockhostProject(bot.dockhostProject ?? this.baseDockhostProject, bot.dockhostContainer ?? this.baseDockhostContainer))
  }

  private async restartContainerFor(bot: BotRecord) { }

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

  private async createContainerFor(bot: BotRecord): Promise<[boolean, Pick<BotRecord, 'dockhostContainer' | 'dockhostImage' | 'dockhostProject'> | null]> {
    const accessToken = await this.getBotAccessToken(bot.id)

    if (accessToken == null)
      return [false, null]

    if (bot.tgBotToken == null)
      return [false, null]

    await this.dockhost.createContainer({
      replicas: 0,
      project: this.baseDockhostProject,
      name: `${this.baseDockhostContainer}-${bot.id}`,
      image: this.baseDockhostImage,
      variable: {
        TITORELLI_CLIENT_ID: this.maskClientId(bot.id, bot.accountId),
        TITORELLI_ACCESS_TOKEN: accessToken,
        TITORELLI_HOST: this.siteOrigin,
        BOT_TOKEN: bot.tgBotToken,
      }
    })

    return [true, {
      dockhostContainer: `${this.baseDockhostContainer}-${bot.id}`,
      dockhostProject: this.baseDockhostProject,
      dockhostImage: this.baseDockhostImage
    }]
  }

  private maskClientId(botId: number, accountId: number) {
    return btoa(`${btoa(String(botId))}:${btoa(String(accountId))}`)
  }

  private unmaskClientId(maskedClientId: string): [number, number] | null {
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

  private async getContainerStatusFor(bot: BotRecord) {
    const containers = await this.dockhost.listContainer(bot.dockhostProject)
    const botContainer = containers.find(({ name }) => bot.dockhostContainer)

    return botContainer.status ?? null
  }

  private async hasContainerInDockhostProject(projectName: string, containerName: string) {
    const containers = await this.dockhost.listContainer(projectName)

    return containers.some(c => c.name === containerName)
  }
}
