import { Knex } from "knex";

export const up = (knex: Knex) =>
  knex.schema.createTable('selfInfo', table => {
    table.increments('id')

    table.integer('tgUserId')
    table.string('firstName')
    table.string('lastName')
    table.string('username')
    table.string('languageCode')
    table.boolean('isPremium')
    table.boolean('addedToAttachmentMenu')
    table.boolean('isBot')
    table.boolean('canJoinGroups')
    table.boolean('canReadAllGroupMessages')
    table.boolean('supportsInlineQueries')

    table.index('tgUserId')
  })

export const down = (knex: Knex) =>
  knex.schema.dropTable('selfInfo')
