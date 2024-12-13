import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('datasets', (table) => {
    table.increments('id').primary()
    table.string('name', 48)

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
  return knex.schema.dropTable('datasets')
}
