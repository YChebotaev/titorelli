import { readFileSync } from 'node:fs'
import axios from 'axios'
import { stableRandomSort, toChunks } from './lib'

const client = axios.create({ baseURL: 'http://localhost:3000' })
const examples = JSON.parse(readFileSync('rs_examples.json', 'utf-8')) as { type: string, text: string }[]
const hamExamples = stableRandomSort(examples.filter(({ type }) => type === 'ham'), 100)
const spamExamples = stableRandomSort(examples.filter(({ type }) => type === 'spam'), 100)
const trainHamExamples = hamExamples.slice(0, hamExamples.length - 1000)
const trainSpamExamples = spamExamples.slice(0, spamExamples.length - 30)
const verifyHamExamples = hamExamples.slice(hamExamples.length - 1000, hamExamples.length - 1)
const verifySpamExamples = spamExamples.slice(spamExamples.length - 1000, spamExamples.length - 1)

const trainExamples = [...trainHamExamples, ...trainSpamExamples]

const verifyExamples = [...verifyHamExamples, ...verifySpamExamples]

const train = async () => {
  const trainExamplesChunks = toChunks(trainExamples, 100)

  console.time('train...')
  for (const chunk of trainExamplesChunks) {
    await client.post('/train_bulk', chunk)
  }
  console.timeEnd('train...')
}

const verify = async () => {
  for (const example of hamExamples) {
    const { data } = await client.post('/classify', example)

    if (data.type !== example.type) {
      console.log('Miss:', example.type, data.type, example.text)
    }
  }

  for (const example of verifyExamples) {
    const { data } = await client.post('/classify', example)

    if (data.type !== example.type) {
      console.log('Miss:', example.type, data.type, example.text)
    }
  }
}

// train()
//   .then(() => {
//     return verify()
//   })

verify()
