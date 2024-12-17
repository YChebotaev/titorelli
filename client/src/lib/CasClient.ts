import { AxiosInstance } from "axios";
import type { LabeledExample } from "../../types";

export class CasClient {
  constructor(
    private getAxios: () => AxiosInstance,
    private getReady: () => Promise<void>,
    private hasGrantedGlobalScope: (scope: string) => boolean
  ) { }

  async train({ tgUserId }: { tgUserId: number }) {
    await this.getReady()

    const hasScope = this.hasGrantedGlobalScope('cas/train')

    if (!hasScope) {
      console.error(
        `Client cannot train cas model because it don\'t have cas/train scope granted`
      )

      return null
    }

    const { data } = await this.getAxios().post<void>(`/cas/train`, { tgUserId })

    return data
  }
}
