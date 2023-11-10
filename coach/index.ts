import { readFileSync } from 'node:fs'
import { createClient, trainBulk, type LabeledExample } from '@titorelli/client'
import { recursivelyUnwrapText } from './lib'

const hamDatasetText = readFileSync('data/result.json', 'utf-8')
const hamTexts: string[] = JSON.parse(hamDatasetText)
  .messages
  .filter(({ type }: { type: string }) => type === 'message')
  .flatMap(recursivelyUnwrapText)
  .slice(0, 1000)

const spamDatasetText = readFileSync('data/spam.txt', 'utf-8')
const spamTexts: string[] = spamDatasetText.split('---').map(text => text.trim())

const client = createClient('http://localhost:3000/react_ru')

trainBulk(client, [
  ...hamTexts.map(text => ({ label: 'ham', text } as LabeledExample)),
  ...spamTexts.map(text => ({ label: 'spam', text } as LabeledExample))
])
