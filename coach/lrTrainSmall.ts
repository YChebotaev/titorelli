import path from 'node:path'
import { LogisticRegressionClassifier } from 'natural'
import { examples } from './examples'

const lrTrainSmall = async () => {
  const classifier = new LogisticRegressionClassifier()
  const hamExamples = examples.filter(({ type }) => type === 'ham').slice(200, 220)

  const smapExamples = examples.filter(({ type }) => type === 'spam').slice(0, 20)
  const combinedExamples = [...hamExamples, ...smapExamples]

  console.log(JSON.stringify(combinedExamples, null, 2))

  for (const { type, text } of combinedExamples) {
    classifier.addDocument(text, type)
  }

  classifier.train()

  classifier.save(
    path.join(__dirname, 'data/small-example.json')
  )
}

if (require.main === module) {
  lrTrainSmall()
}
