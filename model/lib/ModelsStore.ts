import { createModel } from "./createModel";
import type { IModel } from "./models/IModel";
import type { ModelType } from "../types";

export class ModelsStore {
  private internal = new Map<string, IModel>()

  constructor(private modelsDirname, private modelType: ModelType) {
  }

  async getOrCreate(modelId: string) {
    if (this.has(modelId)) {
      return this.internal.get(this.getKey(modelId))
    } else {
      const model = await createModel(this.modelsDirname, this.modelType as any, modelId)

      this.internal.set(this.getKey(modelId), model)

      return model
    }
  }

  private has(modelId: string) {
    return this.internal.has(this.getKey(modelId))
  }

  private getKey(modelId: string) {
    return `${this.modelType}-${modelId}`
  }
}
