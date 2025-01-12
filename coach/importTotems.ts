import path from 'node:path'
import createKnex from 'knex'

const importTotems = async () => {
  const importKnex = createKnex({
    client: 'sqlite3',
    connection: { filename: path.join(__dirname, 'data/db.sqlite3') }
  })
  const exportKnex = createKnex({
    client: 'sqlite3',
    connection: { filename: path.join(__dirname, 'data/totems-react_ru.sqlite3') },
    acquireConnectionTimeout: 60 * 60 * 60 * 1000
  })

  const totems = await importKnex
    .select<{ tgUserId: number, createdAt: number }[]>('*')
    .from('totems')

  await exportKnex.schema.createTable('totems', table => {
    table.increments('id').primary()
    table.integer('tgUserId')

    table.dateTime('createdAt')
    table.dateTime('updatedAt').nullable()

    table.index('tgUserId')
  })

  for (const totem of totems) {
    await exportKnex
      .insert({
        tgUserId: totem.tgUserId,
        createdAt: totem.createdAt
      })
      .into('totems')
  }
}

if (require.main === module) {
  importTotems()
}
