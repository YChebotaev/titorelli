import { AxiosInstance } from "axios";

export class TotemsClient {
  constructor(
    private getAxios: () => AxiosInstance,
    private getReady: () => Promise<void>,
    private getModelId: () => string,
    private hasGrantedModelScope: (scope: string) => boolean
  ) { }

  async train({ tgUserId }: { tgUserId: number }) {
    await this.getReady()

    const hasScope = this.hasGrantedModelScope('totems/train')

    if (!hasScope) {
      console.error(
        `Client cannot train totems model because it don\'t have ${this.getModelId()}/totems/train scope granted`
      )

      return null
    }

    const { data } = await this.getAxios().post<void>(`/models/${this.getModelId()}/totems/train`, { tgUserId })

    return data
  }
}
