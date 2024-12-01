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

const apply = async <F extends Function, P extends any[]>(fn: F, req: RpcRequest<P>) => {
  try {
    const result = await fn.apply(null, req.params)

    const res: RpcResponse<typeof result> = {
      id: req.id,
      result
    }

    return res
  } catch (error) {
    console.error(error)

    const res: RpcResponse<void, typeof error> = {
      id: req.id,
      error
    }

    return res
  }
}

parentPort?.on('message', async (req: RpcRequest<any[]>) => {
  switch (req.method) {
    case 'trainBulk': {
      const res = await apply(trainBulk, req)

      parentPort.postMessage(res)

      return
    }
  }
})
