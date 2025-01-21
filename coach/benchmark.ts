import { readFileSync } from 'node:fs'
import path from 'node:path'
import createKnex from 'knex'
import { LogisticRegression } from '@titorelli/logistic-regression'
import { LogisticRegressionClassifier, PorterStemmerRu } from 'natural'

const learningRate = 0.01
const iterations = 1000
const classifier = new LogisticRegression({ learningRate, iterations })

let naturalClassifier: LogisticRegressionClassifier

const pretrainNew = async () => {
  {
    const data = JSON.parse(
      readFileSync('../service/data/logistic-regression-react_ru-previous.json', 'utf-8')
    )

    let docs: string[] = data.docs.map(({ text }) => text.join(' '))
    let labels: number[] = data.docs.map(({ label }) => label === 'ham' ? 0 : 1)

    classifier.train(docs, labels)

    {
      naturalClassifier = await new Promise(resolve =>
        LogisticRegressionClassifier.load(
          '../service/data/logistic-regression-react_ru-previous.json',
          PorterStemmerRu,
          (err, c) => resolve(c)
        )
      )
    }
  }

  // classifier.saveModel('data/logistic-regression-react_ru.json')
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

  const results = []

  {
    let tpCount = 0
    let tnCount = 0
    let fpCount = 0
    let fnCount = 0

    for (const { text, label } of examples) {
      const classifierLabel = naturalClassifier.classify(text)

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

    results.push({ accuracy, recall, fpr, precision, f1, missRate, f2 })

    console.group('Natural classifier (0)')

    console.log('Accuracy:', accuracy)
    console.log('Recall:', recall)
    console.log('False positive rate:', fpr)
    console.log('False negative rate:', missRate)
    console.log('Precision:', precision)
    console.log('F1:', f1)
    console.log('F2:', f2)

    console.groupEnd()
  }

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

    results.push({ accuracy, recall, fpr, precision, f1, missRate, f2 })

    console.group('Native classifier (0)')

    // console.log('Learning rate:', learningRate)
    // console.log('Iterations:', iterations)

    console.log('Accuracy:', accuracy)
    console.log('Recall:', recall)
    console.log('False positive rate:', fpr)
    console.log('False negative rate:', missRate)
    console.log('Precision:', precision)
    console.log('F1:', f1)
    console.log('F2:', f2)

    console.groupEnd()
  }

  {
    let tpCount = 0
    let tnCount = 0
    let fpCount = 0
    let fnCount = 0

    for (const { text } of examples) {
      const score = classifier.classify(PorterStemmerRu.tokenizeAndStem(text).join(' '))
      const classifierLabel = score <= 0.5 ? 'ham' : 'spam'
      const benchmarkLabel = naturalClassifier.classify(text)

      if (classifierLabel === benchmarkLabel) {
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

    results.push({ accuracy, recall, fpr, precision, f1, missRate, f2 })

    console.group('Benchmark (2)')

    console.log('Accuracy:', accuracy)
    console.log('Recall:', recall)
    console.log('False positive rate:', fpr)
    console.log('False negative rate:', missRate)
    console.log('Precision:', precision)
    console.log('F1:', f1)
    console.log('F2:', f2)

    console.groupEnd()
  }

  console.table(results)
}

if (require.main === module) {
  pretrainNew()
    .then(validate)
    .then(() => process.exit(0))
}
