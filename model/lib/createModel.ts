import path from 'node:path'

import { mkdirp } from 'mkdirp'

import { YandexGptModel } from './models/YandexGpt'
import { LogisticRegressionModel } from './models/LogisticRegression'
import { EnsembleModel } from './models/Ensemble'
import { CustomRulesModel } from './models/CustomRules'
import type { ModelType } from '../types'
import type { IModel } from './models'
import { VowpalWabbitModel } from './models/VowpalWabbit'
import replaceExt from 'replace-ext'

export const createModel = async (
  modelsDirname: string,
  modelType: ModelType,
  modelId: string
): Promise<IModel> => {
  await mkdirp(modelsDirname)

  const modelFilename = path.join(modelsDirname, `${modelType}-${modelId}.json`)

  switch (modelType) {
    case 'yandex-gpt':
      const functionUrl = process.env.YANDEX_FUNCTION_URL

      if (!functionUrl) throw new Error('YANDEX_FUNCTION_URL environment variable must be set')

      return new YandexGptModel(modelId, modelFilename + 'l' /* .jsonl */, functionUrl)

    case 'logistic-regression':
      return new LogisticRegressionModel(modelId, modelFilename, 'ru')

    case 'ensemble':
      return new EnsembleModel(modelId, [
        await createModel(modelsDirname, 'yandex-gpt', modelId),
        await createModel(modelsDirname, 'logistic-regression', modelId),
        await createModel(modelsDirname, 'custom-rules', modelId)
      ])

    case 'custom-rules':
      return new CustomRulesModel()

    case 'vowpal-wabbit':
      return new VowpalWabbitModel(modelId, replaceExt(modelFilename, '.vw'))

    default:
      return null
  }
}
