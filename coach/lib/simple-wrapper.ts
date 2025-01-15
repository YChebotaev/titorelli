import { readFileSync } from 'node:fs'
import path from 'node:path'
import createKnex from 'knex'
import { LogisticRegression } from '@titorelli/logistic-regression'
import { PorterStemmerRu } from 'natural'

const classifier = new LogisticRegression({ learningRate: 0.01, iterations: 1000 })

const pretrainNew = async () => {
  const data = JSON.parse(
    readFileSync('../service/data/logistic-regression-react_ru-previous.json', 'utf-8')
  )

  let docs: string[] = data.docs.map(({ text }) => text.join(' '))
  let labels: number[] = data.docs.map(({ label }) => label === 'ham' ? 0 : 1)

  classifier.train(docs, labels)
}

const validate = async () => {
  const db = createKnex({
    client: 'sqlite3',
    connection: { filename: path.join(__dirname, '../data/db.sqlite3') },
    useNullAsDefault: true
  })

  const examples = await db
    .select<{ text: string, label: string }[]>(['reason', 'text', 'label'])
    .where({ reason: 'classifier' })
    .from('examples')

  await db.destroy()

  {
    let tpCount = 0
    let tnCount = 0
    let fpCount = 0
    let fnCount = 0

    for (const { text, label } of examples) {
      const score = classifier.classify(PorterStemmerRu.tokenizeAndStem(text).join(' '))
      const classifierLabel = score <= 0.5 ? 'ham' : 'spam'

      if (classifierLabel === label) {
        if (classifierLabel === 'spam') {
          tpCount += 1
        } else {
          tnCount += 1
        }
      } else {
        if (classifierLabel === 'spam') {
          fpCount += 1
        } else {
          fnCount += 1
        }
      }
    }

    const accuracy = (tpCount + tnCount) / (tpCount + tnCount + fpCount + fnCount)
    const recall = tpCount / (tpCount + fnCount)
    const fpr = fpCount / (fpCount + tnCount)
    const missRate = fnCount / (fnCount + tpCount) // fnr
    const precision = tpCount / (tpCount + fpCount)
    const f1 = tpCount / (tpCount + (fpCount + fnCount) / 2)
    const f2 = (1 + 2 ^ 2) * (precision * recall) / (2 ^ 2 * (precision + recall))

    return { accuracy, recall, fpr, missRate, precision, f1, f2 }
  }
}

if (require.main === module) {
  pretrainNew()
    .then(validate)
    .then((result) => {
      process.stdout.write(
        JSON.stringify(
          result
        )
      )

      process.exit(0)
    })
}

