import { Knex } from "knex";

export const up = (knex: Knex) =>
  knex.schema.createTable('chatInfo', table => {
    table.increments('id')

    table.integer('tgChatId')
    table.string('type')
    table.string('username')
    table.string('title')
    table.string('firstName')
    table.string('lastName')
    table.boolean('isForum')
    table.string('description')
    table.string('bio')

    table.index('tgChatId')
  })

export const down = (knex: Knex) =>
  knex.schema.dropTable('chatInfo')
