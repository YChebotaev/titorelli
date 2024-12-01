import axios, { type Axios } from 'axios'
import { clientCredentials } from 'axios-oauth-client'
import { Prediction, type UnlabeledExample } from '../types'

export type TitorelliClientConfig = {
  serviceUrl: string
  clientId: string
  clientSecret: string
  scope?: string
}

export type TitorelliModelClientConfig = {
  axios: Axios
  modelId: string
  getReadyPromise(): Promise<void>
}

export class TitorelliModelClient {
  private axios: Axios
  private modelId: string

  constructor({ axios, modelId, getReadyPromise }: TitorelliModelClientConfig) {
    this.axios = axios
    this.modelId = modelId
    this.getReadyPromise = getReadyPromise
  }

  async predict(example: UnlabeledExample) {
    await this.getReadyPromise()

    const { data } = await this.axios.post<Prediction>(`/${this.modelId}/predict`, example)

    return data
  }

  private getReadyPromise(): Promise<void>
  private getReadyPromise() { return Promise.reject() }
}

export class TitorelliClient {
  private ready: Promise<void>
  private axios: Axios
  private serviceUrl: string
  private clientId: string
  private clientSecret: string

  constructor({ serviceUrl, clientId, clientSecret, scope }: TitorelliClientConfig) {
    if (!serviceUrl) throw new Error('serviceUrl must be provided')
    if (!clientId) throw new Error('clientId must be provided')
    if (!clientSecret) throw new Error('clientSecret must be provided')

    this.serviceUrl = serviceUrl
    this.clientId = clientId
    this.clientSecret = clientSecret

    this.axios = axios.create({ baseURL: serviceUrl })

    this.ready = this.initialize({ scope })
  }

  model(modelId: string) {
    return new TitorelliModelClient({
      axios: this.axios,
      modelId,
      getReadyPromise: () => this.ready
    })
  }

  private async initialize({ scope }: { scope: string }) {
    const authResult = await this.authenticate({ scope })

    this.axios.interceptors.request.use((config) => {
      config.headers.Authorization = `${authResult.token_type} ${authResult.access_token}`

      return config
    })
  }

  private async authenticate({ scope }: { scope: string }) {
    const url = new URL('/oauth2/token', this.serviceUrl).toString()

    const getClientCredentials = clientCredentials(this.axios, url, this.clientId, this.clientSecret)

    return getClientCredentials(scope)
  }
}
