import { writeFile } from 'node:fs/promises'
import { LogisticRegressionClassifier } from 'natural'
import { getStemmer } from './getStemmer'
import type { Model, StemmerLanguage } from '../../types'

export const createModel = async (filename: string, lang: StemmerLanguage) => {
  const stemmer = getStemmer(lang)
  const model: Model = {
    type: 'logistic-regression',
    lang,
    data: new LogisticRegressionClassifier(stemmer)
  }

  await writeFile(filename, JSON.stringify(model, null, 2), 'utf-8')

  return model
}
