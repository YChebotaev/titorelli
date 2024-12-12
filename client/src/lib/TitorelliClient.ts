import axios, { type AxiosInstance } from 'axios'
import { clientCredentials } from 'axios-oauth-client'
import type { Prediction, UnlabeledExample, LabeledExample } from '../../types'

export type ClientScopes = 'predict' | 'train' | 'train_bulk'

export type TitorelliClientConfig = {
  serviceUrl: string
  clientId: string
  clientSecret: string
  modelId: string
  scope?: ClientScopes | ClientScopes[]
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

    const { data } = await this.axios.post<Prediction>(`/${this.modelId}/predict`, reqData)

    return data
  }

  async train(example: LabeledExample) {
    await this.ready

    const { data } = await this.axios.post<void>(`${this.modelId}/train`, example)

    return data
  }

  private async initialize({ scope }: { scope: ClientScopes | ClientScopes[] }) {
    const authResult = await this.authenticate({ scope })

    this.axios.interceptors.request.use((config) => {
      config.headers.Authorization = `${authResult.token_type} ${authResult.access_token}`

      return config
    })
  }

  private async authenticate({ scope }: { scope: ClientScopes | ClientScopes[] }) {
    const url = new URL('/oauth2/token', this.serviceUrl).toString()

    const getClientCredentials = clientCredentials(this.axios, url, this.clientId, this.clientSecret)

    const finalScope = [scope].flatMap(scope => `${this.modelId}/${scope}`)

    return getClientCredentials(finalScope)
  }
}
