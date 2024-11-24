import { type LogisticRegressionClassifier } from "natural"
import type { LabeledExample, Model } from '../../types'

export const trainBulk = (model: Model, examples: LabeledExample[]) => {
  const classiffier = model.data as LogisticRegressionClassifier

  for (const example of examples) {
    classiffier.addDocument(example.text, example.label)
  }

  classiffier.train()
}
