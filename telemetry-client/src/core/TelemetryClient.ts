import axios, { AxiosInstance } from "axios"
import { clientCredentials } from 'axios-oauth-client'
import type { SelfInfo, UserInfo, ChatInfo, MessageInfo } from './types'

export type TelemetryClientConfig = {
  serviceUrl: string,
  bypassToken?: string | null
}

export class TelemetryClient {
  private serviceUrl: string
  private bypassToken?: string
  private axios: AxiosInstance
  private ready: Promise<void>

  constructor({
    serviceUrl,
    bypassToken,
  }: TelemetryClientConfig) {
    this.serviceUrl = serviceUrl
    this.bypassToken = bypassToken
    this.axios = axios.create({ baseURL: `${this.serviceUrl}/telemetry` })

    this.ready = this.authorize()
  }

  async trackSelfBotInfo(botInfo: SelfInfo) {
    await this.ready

    const { data } = await this.axios.post<void>('/track_bot', botInfo)

    return data
  }

  async trackMemberInfo(userInfo: UserInfo) {
    await this.ready

    const { data } = await this.axios.post<void>('/track_member', userInfo)

    return data
  }

  async trackChat(chatInfo: ChatInfo) {
    await this.ready

    const { data } = await this.axios.post<void>('/track_chat', chatInfo)

    return data
  }

  async trackMessage(messageInfo: MessageInfo) {
    await this.ready

    const { data } = await this.axios.post<void>('/track_message', messageInfo)

    return data
  }

  async trackPrediction(tgChatId: number, tgMessageId: number, prediction: any) {
    await this.ready

    const { data } = await this.axios.post<void>('/track_prediction', { tgChatId, tgMessageId, ...prediction })

    return data
  }

  private async authorize() {
    if (this.bypassToken == null)
      return

    const url = new URL('/oauth2/token', this.serviceUrl).toString()

    const getTelemetryCredentials = clientCredentials(this.axios, url, `telemetry`, this.bypassToken)

    const { access_token, token_type } = await getTelemetryCredentials('telemetry/bypass') as Awaited<{
      access_token: string
      token_type: string
    }>

    this.axios.defaults.headers.common.Authorization = `${token_type} ${access_token}`
  }
}
