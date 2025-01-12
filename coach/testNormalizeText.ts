import path from 'node:path'
import createKnex from 'knex'
import { normalizeText } from '@titorelli/model/lib/normalizeText'

const testNormalizeText = async () => {
  const knex = createKnex({
    client: 'sqlite3',
    connection: { filename: path.join(__dirname, 'data/db.sqlite3') }
  })

  const examples = await knex
    .select<{text: string}[]>(['text'])
    .from('examples')

  for (const { text } of examples) {
    console.log(text)
    console.log('\n')
    console.log(normalizeText(text))
    console.log('\n\n')
  }
}

if (require.main === module) {
  testNormalizeText()
}
