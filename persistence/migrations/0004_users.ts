import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.string('name', 48)
    table.string('passwordHash', 255)
    table.string('passwordSalt', 255)
    table.json('contacts').defaultTo([])

    table.integer('accountId')
    table.dateTime('createdAt')
    table.dateTime('updatedAt').nullable().defaultTo(null)

    table.index('name')
    table.index('accountId')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users')
}
