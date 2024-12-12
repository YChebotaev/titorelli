import { appendFileSync } from 'node:fs'
import path from 'node:path'
import { createClient } from '@titorelli/client'

const validate = async () => {
  const { examples } = await import('./examples')

  const resultsFilename = path.join(__dirname, 'data/validation-results.txt')
  const client = createClient({
    serviceUrl: '--insert-value--',
    clientId: '--insert-value--',
    clientSecret: '--insert-value',
    scope: 'predict'
  })
  const model = client.model('react_ru')

  for (const { text, type } of examples) {
    const { value } = await model.predict({ text })

    appendFileSync(resultsFilename, `(${value === type ? 'match' : 'miss'}) ${value}/${type}: ${text}\n`)
  }
}

if (require.main === module) {
  validate()
}
