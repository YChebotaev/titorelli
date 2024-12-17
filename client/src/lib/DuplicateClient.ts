import { AxiosInstance } from "axios";
import type { LabeledExample } from "../../types";

export class DuplicateClient {
  constructor(
    private getAxios: () => AxiosInstance,
    private getReady: () => Promise<void>,
    private getModelId: () => string,
    private hasGrantedModelScope: (scope: string) => boolean
  ) { }

  async train(example: LabeledExample) {
    await this.getReady()

    const hasScope = this.hasGrantedModelScope('exact_match/train')

    if (!hasScope) {
      console.error(
        `Client cannot train duplicate model because it don\'t have ${this.getModelId()}/exact_match/train scope granted`
      )

      return null
    }

    const { data } = await this.getAxios().post<void>(`/models/${this.getModelId()}/exact_match/train`, example)

    return data
  }
}
