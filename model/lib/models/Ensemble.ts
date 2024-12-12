import { UnlabeledExample, Prediction, LabeledExample, ModelType } from "../../types";
import type { IModel } from "./IModel";

export class EnsembleModel implements IModel {
  public type = 'ensemble' as const

  constructor(
    private modelId,
    private models: IModel[],
    private enableLearningFromCustomRules: boolean = false
  ) {
  }

  async predict(example: UnlabeledExample): Promise<Prediction | null> {
    const customRules = this.getModelByType('custom-rules')
    const logisticRegression = this.getModelByType('logistic-regression')
    const yandexGpt = this.getModelByType('yandex-gpt')

    if (!logisticRegression || !yandexGpt)
      throw new Error('Some models are not provided')

    if (customRules) {
      const crPrediction = await customRules.predict(example)

      if (crPrediction.value === 'spam') {
        if (this.enableLearningFromCustomRules) {
          void this.train({ text: example.text, label: crPrediction.value })
        }

        return crPrediction
      }
    }

    const lrPrediction = await logisticRegression.predict(example)

    if (!lrPrediction)
      throw new Error('Cannot get prediction from logistic-regression model')

    const isUncertain = lrPrediction.confidence <= 0.6

    if (isUncertain) {
      const yGptPrediction = await yandexGpt.predict(example)

      if (!yGptPrediction) throw new Error('Cannot get prediction from yandex-gpt model')

      switch (`${lrPrediction.value}-${yGptPrediction.value}`) {
        case 'ham-ham': return { value: 'ham', confidence: 1 }
        case 'spam-spam': return { value: 'spam', confidence: 1 }
        case 'ham-spam':
        case 'spam-ham':
          return [lrPrediction, yGptPrediction].sort((a, b) => b.confidence - a.confidence)[0]
      }
    }

    return lrPrediction
  }

  async train(example: LabeledExample): Promise<void> {
    await Promise.all(
      this.models.map(model => model.train(example))
    )
  }

  async trainBulk(examples: LabeledExample[]): Promise<void> {
    await Promise.all(
      this.models.map(model => model.trainBulk(examples))
    )
  }

  private getModelByType(type: ModelType) {
    return this.models.find((model) => model.type === type)
  }

  onCreated(): void {
    for (const model of this.models) {
      model.onCreated()
    }
  }

  onRemoved(): void {
    for (const model of this.models) {
      model.onRemoved()
    }
  }
}
