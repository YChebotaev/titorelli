import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('totems', (table) => {
    table.increments('id').primary()
    table.integer('tgUserId')

    table.integer('accountId')
    table.integer('modelId')
    table.dateTime('createdAt')
    table.dateTime('updatedAt').nullable().defaultTo(null)

    table.index('tgUserId')
    table.index('accountId')
    table.index('modelId')
    table.index('createdAt')
    table.index('updatedAt')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('totems')
}
