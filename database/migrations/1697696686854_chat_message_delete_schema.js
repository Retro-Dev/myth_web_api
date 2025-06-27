'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ChatMessageDeleteSchema extends Schema {
  up () {
    this.create('chat_message_delete', (table) => {
      table.increments()
      table.integer('user_id').notNullable();
      table.integer('chat_room_id').defaultTo(0);
      table.integer('chat_message_id').notNullable();
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('chat_message_delete')
  }
}

module.exports = ChatMessageDeleteSchema
