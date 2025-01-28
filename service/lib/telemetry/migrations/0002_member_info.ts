import { Knex } from "knex";

export const up = (knex: Knex) =>
  knex.schema.createTable('memberInfo', table => {
    table.increments('id')

    table.integer('tgUserId')
    table.boolean('isBot')
    table.string('firstName')
    table.string('lastName')
    table.string('username')
    table.string('languageCode')
    table.boolean('isPremium')
    table.boolean('addedToAttachmentMenu')

    table.index('tgUserId')
  })

export const down = (knex: Knex) =>
  knex.schema.dropTable('memberInfo')
