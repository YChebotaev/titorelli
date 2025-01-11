import path from 'node:path'
import createKnex from 'knex'
import pino from 'pino'
import { YandexGptModel } from '@titorelli/model'

type ExampleRecord = {
  id: number
  label: 'spam' | 'ham',
  text: string
  confidence: number
}

const knex = createKnex({
    client: 'sqlite3',
    connection: { filename: path.join(__dirname, 'data/db.sqlite3') },
    acquireConnectionTimeout: 60 * 60 * 60 * 1000
  })

const gptVerify = async () => {
  const model = new YandexGptModel(
    'react_ru',
    path.join(__dirname, 'data/--yandex-gpt-training-set--.jsonl'),
    'https://functions.yandexcloud.net/d4etdrmsgg1gpc690t7l',
    pino()
  )

  const examples = await knex
    .select<ExampleRecord[]>(['label', 'text', 'confidence', 'id'])
    .from('examples')
    .whereNot('label', null)
    .andWhere('id', '>', 552)

  for (const { id, label, confidence, text } of examples) {
    await new Promise(resolve => setTimeout(resolve, 1200))

    const prediction = await model.predict({ text })

    if (prediction.value === label) {
      // console.log(`${label}:${confidence}/${prediction.confidence} ${text}`)
    } else {
      console.log(`${id}: ${label}:${confidence} ${prediction.value}:${prediction.confidence} ${text}`)
    }
  }

  console.log('complete!')
}

if (require.main === module) {
  gptVerify()
}
