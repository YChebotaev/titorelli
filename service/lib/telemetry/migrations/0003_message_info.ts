import { Knex } from "knex";

export const up = (knex: Knex) =>
  knex.schema.createTable('messageInfo', table => {
    table.increments('id')

    table.integer('tgMessageId')
    table.string('type')
    table.integer('threadId')
    table.integer('fromTgUserId')
    table.integer('senderTgChatId')
    table.string('date')
    table.integer('tgChatId')
    table.boolean('isTopic')
    table.string('text')
    table.string('caption')

    table.index('tgMessageId')
    table.index('threadId')
    table.index('senderTgChatId')
    table.index('tgChatId')
  })

export const down = (knex: Knex) =>
  knex.schema.dropTable('messageInfo')
