import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('bots', (table) => {
    table.increments('id').primary()
    table.string('name', 48)
    table.string('secretHash', 255)
    table.string('secretSalt', 255)
    table.json('modelIds').defaultTo([])
    table.json('scopes').defaultTo([])

    table.integer('accountId')
    table.dateTime('createdAt')
    table.dateTime('updatedAt').nullable().defaultTo(null)

    table.index('name')
    table.index('accountId')
    table.index('createdAt')
    table.index('updatedAt')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('bots')
}
