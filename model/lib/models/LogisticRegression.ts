import { LogisticRegressionWorker } from './LogisticRegressionWorker'
import type { Logger } from 'pino'

import type { UnlabeledExample, Prediction, LabeledExample, StemmerLanguage } from '../../types'
import type { IModel } from './IModel'

export class LogisticRegressionModel implements IModel {
  private worker: LogisticRegressionWorker

  public type = 'logistic-regression' as const

  constructor(
    private modelId: string,
    private modelFilename: string,
    private lang: StemmerLanguage,
    private logger: Logger
  ) {
    this.worker = new LogisticRegressionWorker(this.modelFilename)
  }

  async predict(example: UnlabeledExample): Promise<Prediction | null> {
    const score = await this.worker.classify(example.text)
    const label = score <= 0.5 ? 'ham' : 'spam'

    return {
      value: label,
      confidence: score,
      reason: 'classifier'
    }
  }

  async train(example: LabeledExample): Promise<void> {
    await this.trainBulk([example])
  }

  async trainBulk(examples: LabeledExample[]): Promise<void> {
    await this.worker.trainBulk(examples)
  }

  onCreated(): void {
    // Do nothing
  }

  onRemoved(): void {
    // Do nothing
  }
}
