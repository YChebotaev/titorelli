import { parentPort, workerData } from 'node:worker_threads'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { PorterStemmerRu } from 'natural'
import { LogisticRegression } from '@titorelli/logistic-regression'

const { modelFilename } = workerData as {
  modelFilename: string
}

const classifier = new LogisticRegression({ learningRate: 0.01, iterations: 1000 })

if (existsSync(modelFilename)) {
  classifier.loadModel(modelFilename)
} else {
  const fullModelFilename = path.join(path.dirname(modelFilename), 'yandex-dataset.json')

  if (existsSync(fullModelFilename)) {
    const dataset = readFileSync(fullModelFilename, 'utf-8')
      .trim()
      .split('\n')
      .map(text => JSON.parse(text.trim()))
      .map(item => ({
        text: PorterStemmerRu.tokenizeAndStem(item.text).join(' '),
        label: item['спам'] ? 'spam' : 'ham'
      }))

    const docs = dataset.map(({ text }) => text)
    const labels = dataset.map(({ label }) => label === 'ham' ? 0 : 1)

    classifier.train(docs, labels)

    classifier.saveModel(modelFilename)
  } else {
    throw new Error('Cannot pretrain classifier bc full dataset doesen\'t exist')
  }
}

parentPort?.postMessage({ method: 'ready' })

const classify = async (normalizedText: string) => {
  return classifier.classify(normalizedText)
}

const trainBulk = async (docs: string[], labels: number[]) => {
  classifier.train(docs, labels)

  classifier.saveModel(modelFilename)
}

const apply = async <F extends Function, P extends any[]>(fn: F, req: { id: number, method: string, params: any[] }) => {
  try {
    const result = await fn.apply(null, req.params)

    const res = {
      id: req.id,
      result
    }

    return res
  } catch (error) {
    console.error(error)

    const res = {
      id: req.id,
      error
    }

    return res
  }
}

const getHandler = (method: string) => {
  switch (method) {
    case 'classify':
      return classify
    case 'trainBulk':
      return trainBulk
  }
}

parentPort?.on('message', async (req: { id: number, method: string, params: any[] }) => {
  const handler = getHandler(req.method)

  if (!handler)
    return

  const res = await apply(handler, req)

  parentPort?.postMessage(res)

  return
})
