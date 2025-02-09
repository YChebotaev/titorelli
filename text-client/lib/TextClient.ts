import axios, { AxiosError, AxiosInstance } from 'axios'
import * as uuid from 'uuid'

export type Stats = {
  createdAt: number
  length: number
  lastAccess: number
  countRead: number
}

export class TextClient {
  private axios: AxiosInstance

  constructor(baseUrl: string) {
    this.axios = axios.create({ baseURL: baseUrl })
  }

  async put<Metadata>(txt: string, metadata?: Metadata) {
    if (metadata) {
      const formData = new FormData()

      formData.set('text', txt)
      formData.set('metadata', JSON.stringify(metadata))

      const { data } = await this.axios.put<string>('/text', formData, {
        responseType: 'text'
      })

      return data
    } else {
      const { data } = await this.axios.put<string>('/text', txt, {
        responseType: 'text',
        headers: {
          'Content-Type': 'text/plain'
        }
      })

      return data
    }
  }

  async stats(uuid: string) {
    const { data } = await this.axios.get<Stats>(`/stats/${uuid}`)

    return data
  }

  async metadata<Metadata>(uuid: string, metadata?: Metadata) {
    if (metadata) {
      const { data } = await this.axios.put<boolean>(`/metadata/${uuid}`, metadata)

      return data
    } else {
      try {
        const { data } = await this.axios.get<Metadata>(`/metadata/${uuid}`)

        return data
      } catch (_e: unknown) {
        const e = _e as AxiosError

        if (e.status === 404) {
          return null
        }

        throw _e
      }
    }
  }

  async get(uuid: string) {
    const { data } = await this.axios.get<string>(`/text/${uuid}`)

    return data
  }

  async has(guidOrText: string) {
    if (uuid.validate(guidOrText)) {
      const { data } = await this.axios.post<boolean>(`/text/get_has/${guidOrText}`)

      return data
    } else {
      const { data } = await this.axios.post<boolean>(`/text/get_has`, guidOrText, {
        responseType: 'json',
        headers: {
          'Content-Type': 'text/plain'
        }
      })

      return data
    }
  }

  async hash(txt: string) {
    const { data } = await this.axios.post<string>('/text/get_hash', txt, {
      responseType: 'text',
      headers: {
        'Content-Type': 'text/plain'
      }
    })

    return data
  }

  public getUUIDStringFromText(txt: string) {
    const namespacceUUID = uuid.v5('https://text.api.titorelli.ru/text', '6ba7b811-9dad-11d1-80b4-00c04fd430c8')
    const guid = uuid.v5(txt, namespacceUUID)

    return guid
  }
}
