import { existsSync } from 'node:fs'
import { LogisticRegressionClassifier } from 'natural'

import { getStemmer } from '../models/getStemmer'
import { LogisticRegressionTrainWorker } from './LogisticRegressionTrainWorker'
import type { UnlabeledExample, Prediction, LabeledExample, StemmerLanguage, Labels } from '../../types'
import type { IModel } from './IModel'

export class LogisticRegressionModel implements IModel {
  private classifier: LogisticRegressionClassifier
  private ready: Promise<boolean>
  private trainWorker: LogisticRegressionTrainWorker

  public type = 'logistic-regression' as const

  constructor(private modelId, private modelFilename, private lang: StemmerLanguage) {
    this.trainWorker = new LogisticRegressionTrainWorker(modelFilename, lang)
    this.ready = this.revive()
  }

  async predict(example: UnlabeledExample): Promise<Prediction | null> {
    await this.ready

    try {
      const classifications = this.classifier.getClassifications(example.text)

      return {
        value: classifications[0].label as Labels,
        confidence: classifications[0].value
      }
    } catch (e) {
      console.error(e)

      return null
    }
  }

  async train(example: LabeledExample): Promise<void> {
    await this.trainBulk([example])
  }

  async trainBulk(examples: LabeledExample[]): Promise<void> {
    await this.ready

    if (this.trainWorker.inprogress) {
      await new Promise((resolve, reject) => {
        this.trainWorker.addTrainBulkCompleteListener(() => {
          this.trainWorker
            .trainBulk(examples)
            .then(resolve)
            .catch(reject)
        })
      })
    } else {
      await this.trainWorker.trainBulk(examples)
    }

    this.ready = this.revive()
  }

  async revive() {
    try {
      const stemmer = getStemmer(this.lang)

      if (existsSync(this.modelFilename)) {
        this.classifier = await new Promise((resolve, reject) => {
          LogisticRegressionClassifier.load(this.modelFilename, stemmer, (err, classifier) => {
            if (err) return reject(err)

            if (classifier) return resolve(classifier)

            reject(new Error('Cannot load classifier from file'))
          })
        })

        return true
      } else {
        this.classifier = new LogisticRegressionClassifier(stemmer)

        return true
      }
    } catch (e) {
      console.error(e)

      return false
    }
  }

  onCreated(): void {
    // Do nothing
  }

  onRemoved(): void {
    // Do nothing
  }
}
