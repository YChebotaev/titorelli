import axios, { AxiosInstance } from 'axios'
import * as uuid from 'uuid'

export class TextClient {
  private axios: AxiosInstance

  constructor(baseUrl: string) {
    this.axios = axios.create({ baseURL: baseUrl })
  }

  async put(txt: string) {
    const { data } = await this.axios.put<string>('/', txt, {
      responseType: 'text',
      headers: {
        'Content-Type': 'text/plain'
      }
    })

    return data
  }

  async get(uuid: string) {
    const { data } = await this.axios.get<string>(`/${uuid}`)

    return data
  }

  async has(guidOrText: string) {
    if (uuid.validate(guidOrText)) {
      const { data } = await this.axios.post<boolean>(`/get_has/${guidOrText}`)

      return data
    } else {
      const { data } = await this.axios.post<boolean>(`/get_has`, guidOrText, {
        responseType: 'json',
        headers: {
          'Content-Type': 'text/plain'
        }
      })
  
      return data
    }
  }

  async hash(txt: string) {
    const { data } = await this.axios.post<string>('/get_hash', txt, {
      responseType: 'text',
      headers: {
        'Content-Type': 'text/plain'
      }
    })

    return data
  }

  public getUUIDStringFromText(txt: string) {
    const namespacceUUID = uuid.v5('https://text.api.titorelli.ru', '6ba7b811-9dad-11d1-80b4-00c04fd430c8')
    const guid = uuid.v5(txt, namespacceUUID)

    return guid
  }
}
