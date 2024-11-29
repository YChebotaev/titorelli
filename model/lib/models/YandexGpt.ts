import { appendFile } from 'fs/promises'
import { UnlabeledExample, Prediction, LabeledExample } from "../../types";
import type { IModel } from "./IModel";

export type ClassifyMessageResponse = {
  confidence: number
  value: 'spam' | 'ham'
}

export class YandexGptModel implements IModel {
  public type = 'yandex-gpt' as const

  constructor(private modelId: string, private modelFilename, private functionUrl: string) {
  }

  async predict(example: UnlabeledExample): Promise<Prediction | null> {
    let retriesLeft = 2

    while (retriesLeft > 0) {
      retriesLeft -= 1

      const resp = await fetch(this.functionUrl, {
        method: 'POST',
        body: JSON.stringify({
          modelId: this.modelId,
          text: example.text
        })
      })

      if (resp.ok) {
        const data = await resp.json() as Awaited<ClassifyMessageResponse>

        return data
      }
    }

    return null
  }

  async train({ text, label }: LabeledExample): Promise<void> {
    if (text.trim().length === 0) return null
    if (text.trim().length >= 10000) return null

    const data = {
      text,
      'спам': label === 'spam' ? 1 : 0,
      'не спам': label === 'ham' ? 1 : 0
    }
    const line = JSON.stringify(data)

    await appendFile(this.modelFilename, line + '\n', 'utf-8')
  }

  async trainBulk(examples: LabeledExample[]): Promise<void> {
    for (const example of examples) {
      await this.train(example)
    }
  }
}
