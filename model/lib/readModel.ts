import { readFile } from 'node:fs/promises'
import { LogisticRegressionClassifier } from 'natural'
import type { Model } from '../types'
import { getStemmer } from './getStemmer'

export const readModel = async (filename: string) => {
  const modelText = await readFile(filename, 'utf-8')
  const modelRaw = JSON.parse(modelText)
  const stemmer = getStemmer(modelRaw.lang)
  const model: Model = {
    ...modelRaw,
    data: LogisticRegressionClassifier.restore(modelRaw.data, stemmer)
  }

  return model
}
