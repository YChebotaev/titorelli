import path from 'node:path'
import { Worker } from 'node:worker_threads'
import { PorterStemmerRu } from 'natural'
import type { LabeledExample } from '../../../types'

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

  private get workerPath() {
    return path.join(__dirname, 'worker/worker.ts')
  }

  private get workerData() {
    return {
      modelFilename: this.modelFilename
    }
  }

  private reinintialize = async () => {
    await this.destroy()

    this.impl = new Worker(this.workerPath, { workerData: this.workerData })

    this.impl.on('error', this.exceptionHandler)
    this.impl.on('exit', this.exceptionHandler)

    return this.awaitEvent('ready')
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

  private async awaitEvent<R = void>(eventName: string) {
    return new Promise<R>(resolve => {
      const handler = (evt: { method: string, result?: any }) => {
        if (evt.method !== eventName)
          return

        resolve(evt.result)

        this.impl!.removeListener('message', handler)
      }

      this.impl!.addListener('message', handler)
    })
  }

  private async destroy() {
    if (this.impl) {
      this.impl.removeAllListeners()
      this.impl.unref()
      await this.impl.terminate()

      this.impl = null
    }
  }

  private exceptionHandler = () => {
    this.ready = this.reinintialize()
  }

  private createRequest<Ps extends unknown[]>(method: string, ...params: Ps) {
    return {
      id: this.idSeq++,
      method,
      params
    }
  }
}
