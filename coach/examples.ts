import { readFileSync, writeFileSync } from 'node:fs'
import { recursivelyUnwrapText } from './lib'

const hamDatasetText = readFileSync('data/result.json', 'utf-8')
const hamTexts: string[] = (
  JSON.parse(hamDatasetText)
    .messages
    .filter(({ type }: { type: string }) => type === 'message')
    .flatMap(recursivelyUnwrapText)
)

const spamDatasetText = readFileSync('data/spam.txt', 'utf-8')
const spamTexts: string[] = spamDatasetText.split('---').map(text => text.trim())

export const examples = [
  ...hamTexts.map(text => ({ type: 'ham' as const, text })),
  ...spamTexts.map(text => ({ type: 'spam' as const, text }))
]
