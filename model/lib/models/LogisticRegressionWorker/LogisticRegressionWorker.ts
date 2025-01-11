import { Worker } from 'node:worker_threads'
import path, { resolve } from 'node:path'
import { PorterStemmerRu } from 'natural'
import { LabeledExample } from '../../../types'

export class LogisticRegressionWorker {
  private idSeq = 0
  private impl: Worker | null = null
  private ready: Promise<void>

  constructor(private modelFilename: string) {
    this.ready = this.reinintialize()
  }

  async classify(originalText: string) {
    await this.ready

    const normalizedText = PorterStemmerRu.tokenizeAndStem(originalText).join(' ')

    const req = this.createRequest('classify', normalizedText)

    return this.awaitResponse<number>(req)
  }

  async trainBulk(examples: LabeledExample[]) {
    await this.ready

    const docs = examples.map(({ text }) => PorterStemmerRu.tokenizeAndStem(text).join(' '))
    const labels = examples.map(({ label }) => label === 'ham' ? 0 : 1)
    const req = this.createRequest('trainBulk', docs, labels)

    return this.awaitResponse<void>(req)
  }

  private async awaitResponse<R>(req: ReturnType<typeof this.createRequest>) {
    return new Promise<R>((resolve, reject) => {
      const handler = (res: { id: number, result: R, error: any }) => {
        if (res.id !== req.id)
          return

        if (res.error) {
          reject(res.error)
        } else {
          resolve(res.result)
        }

        this.impl?.removeListener('message', handler)
      }

      this.impl?.addListener('message', handler)

      this.impl?.postMessage(req)
    })
  }

  private reinintialize = async () => {
    if (this.impl) {
      this.impl.removeAllListeners()
      await this.impl.terminate()

      this.impl = null
    }

    const workerPath = path.join(__dirname, 'worker/worker.ts')

    this.impl = new Worker(workerPath, { workerData: { modelFilename: this.modelFilename } })

    const handleException = () => {
      this.ready = this.reinintialize()
    }

    this.impl.on('error', handleException)
    this.impl.on('exit', handleException)

    return new Promise<void>(resolve => {
      const readyHandler = (evt: { method: 'ready' }) => {
        if (evt.method !== 'ready')
          return

        resolve()

        this.impl!.removeListener('message', readyHandler)
      }

      this.impl!.addListener('message', readyHandler)
    })
  }

  private createRequest(method: string, ...params: any[]) {
    return {
      id: this.idSeq++,
      method,
      params
    }
  }
}
