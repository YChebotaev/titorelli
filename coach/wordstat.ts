import { writeFileSync, appendFileSync } from 'node:fs'
import path from 'node:path'
import { PorterStemmerRu } from 'natural'
const sw: string[] = require('stopwords-ru')
  .map(word => PorterStemmerRu.tokenizeAndStem(word).join(''))
  .filter(word => word)
import { examples } from './examples'

const outputFilename = path.join(__dirname, 'data/wordstat.txt')

const bow = async () => {
  writeFileSync(outputFilename, '', 'utf-8')

  const allWords: Record<string, number> = {}

  for (const { text } of examples) {
    const words = PorterStemmerRu.tokenizeAndStem(text)

    for (const word of words) {
      if (sw.includes(word))
        continue

      allWords[word] = (allWords[word] ?? 0) + 1
    }
  }

  const allWordsSorted = Object.entries(allWords)
    .sort((a, b) => b[1] - a[1])

  for (const [word, count] of allWordsSorted) {
    appendFileSync(outputFilename, `${count} ${word}\n`, 'utf-8')
  }
}

if (require.main === module) {
  bow()
}
