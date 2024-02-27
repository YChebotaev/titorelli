import { readFileSync } from 'node:fs'
import { sampleSize } from 'lodash'
import { createClient, predict, trainBulk } from '@titorelli/client'
import { recursivelyUnwrapText, toChunks } from './lib'

const hamDatasetText = readFileSync('data/result.json', 'utf-8')
const hamTexts: string[] = (
  JSON.parse(hamDatasetText)
    .messages
    .filter(({ type }: { type: string }) => type === 'message')
    .flatMap(recursivelyUnwrapText)
    .slice(0, 300)
)
const hamTextsChunks = toChunks(hamTexts, 100)

const spamDatasetText = readFileSync('data/spam.txt', 'utf-8')
const spamTexts: string[] = spamDatasetText.split('---').map(text => text.trim())
const spamTextsChunks = toChunks(spamTexts, 100)

const client = createClient('http://localhost:3000/react_ru')

const train = async () => {
  console.group('run()')

  console.log('spamTextsChunks.length =', spamTextsChunks.length)
  console.log('hamTextsChunks.length =', hamTextsChunks.length)

  let i = 0;

  for (const spamTexts of spamTextsChunks) {
    console.log(i++)
    await trainBulk(client, spamTexts.map(text => ({ label: 'spam', text })))
  }

  for (const hamTexts of hamTextsChunks) {
    console.log(i++)
    await trainBulk(client, hamTexts.map(text => ({ label: 'ham', text })))
  }

  console.groupEnd()
}

const validate = async () => {
  const hamTexts: string[] = sampleSize(
    JSON.parse(hamDatasetText)
      .messages
      .filter(({ type }: { type: string }) => type === 'message')
      .flatMap(recursivelyUnwrapText),
    300
  )

  const hamGroups: {
    min: number
    max: number
    entries: string[]
  }[] = [
      {
        min: 0,
        max: 0.1,
        entries: []
      },
      {
        min: 0.1,
        max: 0.2,
        entries: []
      },
      {
        min: 0.2,
        max: 0.3,
        entries: []
      },
      {
        min: 0.3,
        max: 0.4,
        entries: []
      },
      {
        min: 0.4,
        max: 0.5,
        entries: []
      },
      {
        min: 0.5,
        max: 0.6,
        entries: []
      },
      {
        min: 0.6,
        max: 0.7,
        entries: []
      },
      {
        min: 0.7,
        max: 0.8,
        entries: []
      },
      {
        min: 0.8,
        max: 0.9,
        entries: []
      },
      {
        min: 0.9,
        max: 1,
        entries: []
      }
    ]

  for (const hamText of hamTexts) {
    const { value, confidence } = await predict(client, { text: hamText })

    if (value === 'spam') {
      for (const { min, max, entries } of hamGroups) {
        if (confidence >= min && confidence < max) {
          entries.push(hamText)
        }
      }
    }

    // if (value === 'spam') {
    //   console.group('classified as spam with confidence = ' + confidence)
    //   console.log(hamText)
    //   console.groupEnd()
    // } else {
    //   console.group('classified as ham with confidence = ' + confidence)
    //   console.log(hamText)
    //   console.groupEnd()
    // }
  }

  console.group('hamGroups')
  for (const { min, max, entries } of hamGroups) {
    console.log(`${min}-${max}: ${entries.length}`)
  }
  console.groupEnd()
}

// train().catch(e => console.error(e))
validate().catch(e => console.error(e))
