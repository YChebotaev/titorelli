import { createModel } from "./createModel";
import type { IModel } from "./models/IModel";
import type { ModelType } from "../types";

class ModelHolder {
  private modelId: string
  private modelsDirname: string
  private modelType: ModelType
  private timeoutMs: number
  private timeout: NodeJS.Timeout
  private model: IModel | null

  constructor({
    modelId,
    modelsDirname,
    modelType,
    timeoutMs
  }: {
    modelId: string,
    modelsDirname: string,
    modelType: ModelType,
    timeoutMs: number
  }) {
    this.modelId = modelId
    this.modelsDirname = modelsDirname
    this.modelType = modelType
    this.timeoutMs = timeoutMs

    this.restartTimeout()
  }

  async getOrCreate() {
    let model = this.model

    if (!model) {
      model = await createModel(this.modelsDirname, this.modelType, this.modelId)

      model.onCreated()

      this.model = model
    }

    this.restartTimeout()

    return model
  }

  private onTimeout = () => {
    this.model.onRemoved()

    this.model = null
  }

  private restartTimeout() {
    clearTimeout(this.timeout)

    this.timeout = setTimeout(this.onTimeout, this.timeoutMs)
  }
}

export class ModelsStore {
  private internal = new Map<string, ModelHolder>()

  constructor(
    private modelsDirname: string,
    private modelType: ModelType,
    private storeTimeoutMs: number
  ) { }

  async getOrCreate(modelId: string) {
    let holder = this.get(modelId)

    if (!holder) {
      holder = new ModelHolder({
        modelId,
        modelsDirname: this.modelsDirname,
        modelType: this.modelType,
        timeoutMs: this.storeTimeoutMs
      })

      this.set(modelId, holder)
    }

    return holder.getOrCreate()
  }

  private get(modelId: string) {
    return this.internal.get(this.getKey(modelId))
  }

  private set(modelId: string, holder: ModelHolder) {
    return this.internal.set(this.getKey(modelId), holder)
  }

  private getKey(modelId: string) {
    return `${this.modelType}-${modelId}`
  }
}
