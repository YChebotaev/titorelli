import { readFileSync, writeFileSync } from 'node:fs'
import { recursivelyUnwrapText } from './lib'

const hamDatasetText = readFileSync('data/result.json', 'utf-8')
const hamTexts: string[] = (
  JSON.parse(hamDatasetText)
    .messages
    .filter(({ type }: { type: string }) => type === 'message')
    .flatMap(recursivelyUnwrapText)
    // .filter((_: any, i: number) => i % 500 === 0)
)

const spamDatasetText = readFileSync('data/spam.txt', 'utf-8')
const spamTexts: string[] = spamDatasetText.split('---').map(text => text.trim())

const result: {
  type: string,
  text: string
}[] = [
    ...hamTexts.map(text => ({ type: 'ham', text })),
    ...spamTexts.map(text => ({ type: 'spam', text }))
  ]

writeFileSync('data/rs_examples.json', JSON.stringify(result, null, 2), 'utf-8')
