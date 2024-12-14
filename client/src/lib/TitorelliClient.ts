import axios, { type AxiosInstance } from 'axios'
import { clientCredentials } from 'axios-oauth-client'
import type { Prediction, UnlabeledExample, LabeledExample } from '../../types'

export type TitorelliClientConfig = {
  serviceUrl: string
  clientId: string
  clientSecret: string
  modelId: string
  scope?: string | string[]
}

export class TitorelliClient {
  private ready: Promise<void>
  private axios: AxiosInstance
  private serviceUrl: string
  private clientId: string
  private clientSecret: string
  private modelId: string

  constructor({ serviceUrl, clientId, clientSecret, scope, modelId }: TitorelliClientConfig) {
    if (!serviceUrl) throw new Error('serviceUrl must be provided')
    if (!clientId) throw new Error('clientId must be provided')
    if (!clientSecret) throw new Error('clientSecret must be provided')
    if (!modelId) throw new Error('modelId must be provided')

    this.serviceUrl = serviceUrl
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.modelId = modelId

    this.axios = axios.create({ baseURL: serviceUrl })

    this.ready = this.initialize({ scope })
  }

  async predict(reqData: UnlabeledExample & { tgUserId?: number }) {
    await this.ready

    const { data } = await this.axios.post<Prediction>(`/models/${this.modelId}/predict`, reqData)

    return data
  }

  async train(example: LabeledExample) {
    await this.ready

    const { data } = await this.axios.post<void>(`/models/${this.modelId}/train`, example)

    return data
  }

  async trainExactMatch(example: LabeledExample) {
    await this.ready

    const { data } = await this.axios.post<void>(`/models/${this.modelId}/exact-match/train`, example)

    return data
  }

  async trainCas(tgUserId: number) {
    await this.ready

    const { data } = await this.axios.post<void>(`/cas/train`, { tgUserId })

    return data
  }

  private async initialize({ scope }: { scope: string | string[] }) {
    const authResult = await this.authenticate({ scope })

    this.axios.interceptors.request.use((config) => {
      config.headers.Authorization = `${authResult.token_type} ${authResult.access_token}`

      return config
    })
  }

  private async authenticate({ scope }: { scope: string | string[] }) {
    const url = new URL('/oauth2/token', this.serviceUrl).toString()

    const getClientCredentials = clientCredentials(this.axios, url, this.clientId, this.clientSecret)

    const finalScope = [scope].flatMap(scope => {
      if (scope === 'cas/train')
        return scope

      return `${this.modelId}/${scope}`
    })

    return getClientCredentials(finalScope)
  }
}
