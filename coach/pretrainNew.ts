import { readFileSync } from 'node:fs'
import path from 'node:path'
import createKnex from 'knex'
import { LogisticRegression } from '@titorelli/logistic-regression'
import { PorterStemmerRu } from 'natural'

const classifier = new LogisticRegression({ learningRate: 0.01, iterations: 1000 })

const pretrainNew = async () => {
  {
    const data = JSON.parse(
      readFileSync('../service/data/logistic-regression-react_ru-previous.json', 'utf-8')
    )

    let docs: string[] = data.docs.map(({ text }) => text.join(' '))
    let labels: number[] = data.docs.map(({ label }) => label === 'ham' ? 0 : 1)

    {
      const db = createKnex({
        client: 'sqlite3',
        connection: { filename: path.join(__dirname, 'data/db.sqlite3') },
        useNullAsDefault: true
      })

      const spamExamples = await db
        .select<{ text: string, label: string }[]>(['reason', 'text', 'label'])
        .where({ reason: 'classifier', label: 'spam' })
        .from('examples')

      docs = docs.concat(
        spamExamples.map(({ text }) => PorterStemmerRu.tokenizeAndStem(text).join(' '))
      )
      labels = labels.concat(
        spamExamples.map(({ label }) => label === 'ham' ? 0 : 1)
      )
    }

    classifier.train(docs, labels)
  }

  // {
  //   const dataset = readFileSync('data/yandex-dataset.json', 'utf-8')
  //     .trim()
  //     .split('\n')
  //     .map(text => JSON.parse(text.trim()))
  //     .map(item => ({
  //       text: PorterStemmerRu.tokenizeAndStem(item.text).join(' '),
  //       label: item['спам'] ? 'spam' : 'ham'
  //     }))

  //   const docs = dataset.map(({ text }) => text)
  //   const labels = dataset.map(({ label }) => label === 'ham' ? 0 : 1)

  //   classifier.train(docs, labels)
  // }

  classifier.saveModel(
    path.join(__dirname, 'data/logistic-regression-react_ru.json')
  )
}

const validate = async () => {
  const db = createKnex({
    client: 'sqlite3',
    connection: { filename: path.join(__dirname, 'data/db.sqlite3') },
    useNullAsDefault: true
  })

  const examples = await db
    .select<{ text: string, label: string }[]>(['reason', 'text', 'label'])
    .where({ reason: 'classifier' })
    .from('examples')

  await db.destroy()

  let tpCount = 0
  let tnCount = 0
  let errorsCount = 0
  let fpErrorsCount = 0
  let fnErrorsCount = 0

  for (const { text, label } of examples) {
    const score = classifier.classify(PorterStemmerRu.tokenizeAndStem(text).join(' '))
    const classifierLabel = score <= 0.5 ? 'ham' : 'spam'

    if (classifierLabel !== label) {
      errorsCount += 1

      if (classifierLabel === 'ham') {
        fpErrorsCount += 1
      }

      if (classifierLabel === 'spam') {
        fnErrorsCount += 1
      }
    } else {
      if (classifierLabel === 'ham') {
        tpCount += 1
      } else {
        tnCount += 1
      }
    }
  }

  const tpRate = tpCount / examples.length
  const tnRate = tnCount / examples.length
  const errorRate = errorsCount / examples.length
  const fpErrorRate = fpErrorsCount / examples.length
  const fnErrorRate = fnErrorsCount / examples.length

  console.log('TP rate:', tpRate)
  console.log('TN rate:', tnRate)
  console.log('Error rate:', errorRate)
  console.log('FP error rate:', fpErrorRate)
  console.log('FN error rate:', fnErrorRate)
}

if (require.main === module) {
  pretrainNew()
    .then(validate)
    .then(() => process.exit(0))
}
