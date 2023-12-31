import { type LogisticRegressionClassifier } from 'natural'
import type { Labels, Model, Prediction, UnlabeledExample } from '../types'

export const predict = (model: Model, example: UnlabeledExample): Prediction => {
  const classifier = model.data as LogisticRegressionClassifier

  const classifications = classifier.getClassifications(example.text)
  const confidence = 1 - classifications[1].value / classifications[0].value

  return {
    value: classifications[0].label as Labels,
    confidence
  }
}
