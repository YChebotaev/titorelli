import vwPromise from '@vowpalwabbit/vowpalwabbit'
import type { UnlabeledExample, Prediction, LabeledExample } from "../../types";
import type { IModel } from "./IModel";
import { PorterStemmerRu } from 'natural';

export class VowpalWabbitModel implements IModel {
  private workspace: any
  private ready: Promise<void>

  public type = 'vowpal-wabbit' as const

  constructor(
    private modelId: string,
    private modelFilename: string
  ) {
    this.ready = this.initialize()
  }

  async predict(example: UnlabeledExample): Promise<Prediction | null> {
    await this.ready

    const words = PorterStemmerRu.tokenizeAndStem(example.text)
    let vwExample: any

    try {
      vwExample = this.workspace.parse(`text ${words.join(' ')}`)

      const prediction = this.workspace.predict(vwExample)

      return {
        value: prediction > 0.5 ? 'ham' : 'spam',
        confidence: prediction
      }
    } catch (e) {
      throw e
    } finally {
      vwExample.delete()
    }

    return { value: 'ham', confidence: 1 }
  }

  async train(example: LabeledExample): Promise<void> {
    await this.ready

    // Not implemeted yet
  }

  async trainBulk(examples: LabeledExample[]): Promise<void> {
    await this.ready

    // Not implemented yet
  }

  private async initialize() {
    const { Workspace } = await vwPromise

    this.workspace = new Workspace({
      model_file: this.modelFilename,
      args_str: '--loss_function logistic --link logistic -t'
    })
  }

  onCreated(): void {
    this.ready = this.initialize()
  }

  onRemoved(): void {
    this.workspace.delete()

    delete this.workspace
  }
}
