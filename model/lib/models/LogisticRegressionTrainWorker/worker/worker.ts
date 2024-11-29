require('ts-node/register')

import { parentPort, workerData } from 'node:worker_threads'
import { RpcRequest, RpcResponse } from '../types'
import { LabeledExample, StemmerLanguage } from '../../../../types'
import { LogisticRegressionClassifier } from 'natural'
import { getStemmer } from '../../getStemmer'

const { modelFilename, lang } = workerData as {
  modelFilename: string,
  lang: StemmerLanguage
}

const trainBulk = async (examples: LabeledExample[]) => {
  const stemmer = getStemmer(lang)

  return new Promise<void>((resolve, reject) => {
    LogisticRegressionClassifier.load(modelFilename, stemmer, (err, classifier) => {
      if (err) return reject(err)
      if (!classifier) return reject(new Error('Cannot load classifier'))

      for (const { text, label } of examples) {
        classifier.addDocument(text, label)
      }

      classifier.train()

      classifier.save(modelFilename, (err) => {
        if (err) return reject(err)

        resolve()
      })
    })
  })
}

parentPort?.on('message', async (req: RpcRequest<any[]>) => {
  switch (req.method) {
    case 'trainBulk': {
      try {
        const result = await trainBulk.apply(null, req.params)

        const res: RpcResponse<void> = {
          id: req.id,
          result
        }

        parentPort?.postMessage(res)
      } catch (error) {
        console.error(error)

        const res: RpcResponse<void, Error> = {
          id: req.id,
          error
        }

        parentPort?.postMessage(res)
      }
    }
  }
})
