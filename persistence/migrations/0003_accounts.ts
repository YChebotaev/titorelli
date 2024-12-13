import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('accounts', (table) => {
    table.increments('id').primary()
    table.string('name', 48)
    table.json('administratorIds').defaultTo([])

    table.dateTime('createdAt')
    table.dateTime('updatedAt').nullable().defaultTo(null)

    table.index('name')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('accounts')
}
