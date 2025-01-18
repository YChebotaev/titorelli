import { readFileSync } from 'node:fs'
import path from 'node:path'
import createKnex from 'knex'

const loadOld = async function () {
  const raw = readFileSync(path.join(__dirname, 'data/yandex-dataset.json'), 'utf-8')
  const lines = raw.split('\n')
  
  return lines
    .filter(line => line.trim() !== '')
    .map(line => JSON.parse(line))
    .map(obj => ({
      text: obj.text,
      label: obj['спам'] ? 'spam' : 'ham'
    }))
}

const loadNew = async function () {
  const knex = createKnex({
    client: 'sqlite3',
    connection: { filename: path.join(__dirname, 'data/db.sqlite3') }
  })

  const examples = await knex
    .select(['text', 'label'])
    .distinct('text')
    .from<{ text: string, label: 'spam' | 'ham' }[]>('examples')

  return examples
}

const buildFullDataset = async () => {
  const knex = createKnex({
    client: 'sqlite3',
    connection: { filename: path.join(__dirname, 'data/db-full.sqlite3') }
  })

  await knex.schema.createTable('examples', table => {
    table.increments('id').primary()

    table.text('text')
    table.string('label')
  })

  for (const example of await loadOld()) {
    await knex.insert(example).into('examples')
  }

  for (const example of await loadNew()) {
    await knex.insert(example).into('examples')
  }
}

if (require.main === module) {
  buildFullDataset()
}
