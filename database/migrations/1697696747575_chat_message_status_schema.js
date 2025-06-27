'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ChatMessageStatusSchema extends Schema {
  up () {
    this.create('chat_message_status', (table) => {
      table.increments()
      table.integer('user_id').notNullable();
      table.integer('chat_room_id').defaultTo(0);
      table.integer('chat_message_id').notNullable();
      table.integer('is_read').notNullable().defaultTo(1); // Assuming is_read is of type int
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('chat_message_status')
  }
}

module.exports = ChatMessageStatusSchema
