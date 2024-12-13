import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('models', (table) => {
    table.increments('id').primary()
    table.string('name', 20)
    table.integer('version').defaultTo(0)
    table.string('location', 255).defaultTo('')
    table.integer('datasetId')
    table.integer('parentId').nullable().defaultTo(null)
    table.string('parentName', 20).nullable().defaultTo(null)
    table.json('properties').defaultTo({})

    table.integer('accountId')
    table.dateTime('createdAt')
    table.dateTime('updatedAt').nullable().defaultTo(null)

    table.index('name')
    table.index('version')
    table.index('datasetId')
    table.index('parentId')
    table.index('parentName')
    table.index('accountId')
    table.index('createdAt')
    table.index('updatedAt')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('models')
}
