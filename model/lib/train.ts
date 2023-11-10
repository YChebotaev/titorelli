import { type LogisticRegressionClassifier } from "natural"
import type { LabeledExample, Model } from "../types"

export const train = (model: Model, example: LabeledExample) => {
  const classiffier = model.data as LogisticRegressionClassifier

  classiffier.addDocument(example.text, example.label)
  classiffier.train()
}
