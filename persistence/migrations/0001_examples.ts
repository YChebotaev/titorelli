import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('examples', (table) => {
    table.increments('id').primary()
    table.text('text')
    table.string('textHash', 255)
    table.integer('tgUserId')
    table.integer('tgChatId')
    table.string('modelId', 20)
    table.string('label', 20).nullable().defaultTo(null) // 'spam' | 'ham'
    table.string('classifier', 20).nullable().defaultTo(null)
    table.float('confidence').nullable().defaultTo(null)

    table.integer('accountId')
    table.integer('datasetId')
    table.dateTime('createdAt')
    table.dateTime('updatedAt').nullable().defaultTo(null)

    table.index('textHash')
    table.index('tgUserId')
    table.index('tgChatId')
    table.index('modelId')
    table.index('label')
    table.index('classifier')
    table.index('accountId')
    table.index('datasetId')
    table.index('createdAt')
    table.index('updatedAt')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('examples')
}
