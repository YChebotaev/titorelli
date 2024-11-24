import path from 'node:path'
import { copyFileSync, appendFileSync, readFileSync } from 'fs'
import { mkdirpSync } from 'mkdirp'
import { format } from 'date-fns'
import type { LabeledExample, UnlabeledExample } from '@titorelli/model/types'
import { start } from './start'

export const mergeExamples = (
  newExamples: (LabeledExample | UnlabeledExample)[],
  classifiedExamples: LabeledExample[] = require('./examples').examples
) => {
  const loadedExamples = require('./examples').examples
  const outputDirname = 'data'
  const outputFilename = `merged-examples-${format(new Date(), 'ddd-HH-mm')}.jsonl`
  const fullFilename = path.join(outputDirname, outputFilename)

  mkdirpSync(outputDirname)

  if (loadedExamples === classifiedExamples) {
    copyFileSync('data/yandex-dataset.json', fullFilename)

    for (const example of newExamples) {
      if (!('label' in example)) continue

      appendFileSync(fullFilename, JSON.stringify({
        text: example.text,
        "спам": example.label === 'spam' ? 1 : 0,
        "не спам": example.label === 'ham' ? 1 : 0
      }) + '\n', 'utf-8')
    }

    return {
      readMergedFile() {
        return readFileSync(fullFilename, 'utf-8')
      }
    }
  } else {
    // TODO: TO IMPLEMENT
  }
}

if (require.main === module) {
  start()
}
