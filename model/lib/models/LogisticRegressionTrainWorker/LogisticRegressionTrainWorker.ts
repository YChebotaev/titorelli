import { Worker } from 'node:worker_threads'
import path from 'node:path'

import type { RpcRequest, RpcResponse } from './types'
import type { LabeledExample, StemmerLanguage } from '../../../types'

export class LogisticRegressionTrainWorker {
  private idSequence = 0
  private impl: Worker
  private _inprogress = false
  private trainBulkCompleteListeners: Function[] = []

  constructor(modelFilename: string, lang: StemmerLanguage) {
    this.impl = new Worker(path.join(__dirname, 'worker/worker.ts'), { workerData: { modelFilename, lang } })

    this.impl.on('message', this.onMessage)
    this.impl.on('error', this.onError)
    this.impl.on('exit', this.onExit)
  }

  get inprogress() {
    return this._inprogress
  }

  trainBulk(examples: LabeledExample[]) {
    return new Promise<void>((resolve, reject) => {
      const req: RpcRequest<[LabeledExample[]]> = {
        id: this.idSequence++,
        method: 'trainBulk',
        params: [examples]
      }
      const messageHandler = (res: RpcResponse<void>) => {
        if (res.id === req.id) {
          this._inprogress = false

          if (this.trainBulkCompleteListeners.length > 0) {
            const [listener] = this.trainBulkCompleteListeners.splice(0, 1)

            listener()
          }

          resolve()
        }
      }
      const errorHandler = (err) => {
        reject(err)

        this.impl.off('message', messageHandler)
        this.impl.off('error', errorHandler)
        this.impl.off('exit', errorHandler)
      }

      this.impl.on('message', messageHandler)
      this.impl.once('error', errorHandler)
      this.impl.once('exit', errorHandler)

      this._inprogress = true

      this.impl.postMessage(req)
    })
  }

  addTrainBulkCompleteListener(callback: Function) {
    this.trainBulkCompleteListeners.push(callback)
  }

  private onMessage = () => { }

  private onError = (e: Error) => {
    console.warn('Worker issued error =', e)

    this.impl.terminate()
  }

  private onExit = (exitCode: number) => {
    console.warn('Worker exited with code = %s', exitCode)
  }
}
