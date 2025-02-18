import { type Logger } from "pino";
import { Db } from "../Db";
import { DockhostService, ContainerInstanceStatus } from "./dockhost";

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
  public /* public for tests */ db: Db
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

  public async start(botId: number) {
    await this.db
      .knex('ManagedBot')
      .update<BotRecord>({ state: 'starting' })
      .where('id', botId)

    await this.convergeFor(botId)
  }

  public async convergeFor(botId: number) {
    const bot = await this.getBot(botId);

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

  private async getBot(botId: number) {
    return this.db.knex
      .select('*')
      .from('ManagedBot')
      .where('id', botId)
      .first<BotRecord>()
  }

  private async pushState(bot: BotRecord) {
    const { state: botState } = bot
    const containerStatus = await this.getContainerStatusFor(bot)
    const fullState = `${botState}/${containerStatus}` as `${typeof botState}/${typeof containerStatus}`

    console.log('fullState =', fullState)

    switch (fullState) {
      case 'created/creating':
      case "created/stopped":
      case "created/updating":
      case "created/ready":
      case "created/paused":
        return null
      case "starting/stopped":
        return this.startContainerFor(bot)
      case "starting/creating":
        return null // noop
      case "starting/updating":
        return this.containerMayBeFailedFor(bot)
      case "starting/ready":
        return null // noop
      case "starting/paused":
        return this.startContainerFor(bot)
      case "running/stopped":
        return this.restartContainerFor(bot)
      case "running/creating":
        return null // noop
      case "running/updating":
        return this.containerMayBeFailedFor(bot)
      case "running/ready":
      case "running/paused":
        return this.startContainerFor(bot)
      case "stopping/stopped":
        return null // noop
      case "stopping/creating":
        return null // noop
      case "stopping/updating":
        return null // noop
      case "stopping/ready":
        return this.stopContainerFor(bot)
      case "stopping/paused":
        return this.stopContainerFor(bot)
      case "stopped/stopped":
        return null // noop
      case "stopped/creating":
        return null; // noop
      case "stopped/updating":
        return null // noop
      case "stopped/ready":
        return null // noop
      case "stopped/paused":
        return null
      case "failed/stopped":
        return null // noop
      case "failed/creating":
        return null // noop
      case "failed/updating":
        return null // noop
      case "failed/ready":
        return null // noop
      case "failed/paused":
        return null // noop
      default: return null
    }
  }

  private async containerMayBeFailedFor(bot: BotRecord) { }

  private async startContainerFor(bot: BotRecord) {
    const info = await this.getContainerInfoFor(bot)

    // Обработать случай, когда у контейнера несколько инстансов
    // Обработать случай, когда инстансы у контейнера есть, но они упали

    if (!info.instances || info.instances.length === 0) {
      console.log('start container by scaling')

      const result = await this.dockhost.scaleContainer(bot.dockhostContainer, 1, bot.dockhostProject)

      console.log('result =', result)
    } else {
      console.log('start container by command')

      const result = await this.dockhost.startContainer(bot.dockhostProject, bot.dockhostContainer)

      console.log('result =', result)
    }
  }

  private async shouldCreateContainer(bot: BotRecord) {
    return !(await this.hasContainerInDockhostProject(bot.dockhostProject ?? this.baseDockhostProject, bot.dockhostContainer ?? this.baseDockhostContainer))
  }

  private async restartContainerFor(bot: BotRecord) {
    throw new Error('Not implemeted yet')
  }

  private async stopContainerFor(bot: BotRecord) {
    const info = await this.getContainerInfoFor(bot)

    if (!info.instances || info.instances.length === 0) {
      return null // noop
    }

    await this.dockhost.scaleContainer(bot.dockhostContainer, 0, bot.dockhostProject)
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

  private async getContainerInfoFor(bot: BotRecord) {
    const containers = await this.dockhost.listContainer(bot.dockhostProject)
    const botContainer = containers.find(({ name }) => bot.dockhostContainer)

    return botContainer
  }

  private async getContainerStatusFor(bot: BotRecord) {
    const botContainer = await this.getContainerInfoFor(bot)

    return botContainer.status ?? null
  }

  private async hasContainerInDockhostProject(projectName: string, containerName: string) {
    const containers = await this.dockhost.listContainer(projectName)

    return containers.some(c => c.name === containerName)
  }
}
