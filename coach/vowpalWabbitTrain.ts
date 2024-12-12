import { appendFileSync, writeFileSync, unlinkSync } from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { PorterStemmerRu } from 'natural'

const vwDatasetFilename = path.join(__dirname, 'data/vw-input.vw')
const vwTestDatasetFilename = path.join(__dirname, 'data/vw-test.vw')

const prepareDataset = async () => {
  const { examples } = await import('./examples')

  const shuffledExamples = examples
    .map((example) => ({...example, i: Math.random() * 0xffffff}))
    .sort((a, b) => b.i - a.i)

  writeFileSync(vwDatasetFilename, '', 'utf-8')

  for (const { text, type } of shuffledExamples) {
    const words = PorterStemmerRu.tokenizeAndStem(text)

    const doc = `${type === 'spam' ? -1 : 1} |text ${words.join(' ')}\n`

    appendFileSync(vwDatasetFilename, doc, 'utf-8')
  }
}

const trainModel = async () => {
  execSync(`
    vw \
      -d "${vwDatasetFilename}" \
      -k \
      -c \
      -f data/model.vw \
      --ngram 3 \
      --skips 2 \
      --nn 10 \
      --loss_function logistic \
      --passes 10 \
      --holdout_off
  `)
}

const prepareTestDataset = async () => {
  const { examples } = await import('./examples')
  
  writeFileSync(vwTestDatasetFilename, '', 'utf-8')

  for (const { text, type } of examples) {
    const words = PorterStemmerRu.tokenizeAndStem(text)

    const doc = `${type === 'spam' ? 0 : 1} |text ${words.join(' ')}\n`

    appendFileSync(vwTestDatasetFilename, doc, 'utf-8')
  }
}

const validateModel = async () => {
  await prepareTestDataset()

  execSync(`
    vw \
      -d ${vwTestDatasetFilename} \
      -t \
      --loss_function logistic \
      --link logistic \
      -i data/model.vw \
      -p data/test-out.vw
  `)
}

const vowpalWabbitTrain = async () => {
  await prepareDataset()
  await trainModel()
  await validateModel()
}

if (require.main === module) {
  vowpalWabbitTrain()
}
