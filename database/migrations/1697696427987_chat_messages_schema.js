'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ChatMessagesSchema extends Schema {
  up () {
    this.create('chat_messages', (table) => {
      table.increments()
      table.integer('user_id').notNullable();
      table.integer('chat_room_id').notNullable();
      table.integer('panic_id').notNullable().defaultTo(0);
      table.text('message').notNullable();
      table.text('file_url').nullable();
      table.text('file_data').nullable();
      table.string('message_type', 100).notNullable().defaultTo('text');
      table.string('ip_address', 100).nullable();
      table.tinyint('is_anonymous').defaultTo(0);
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('chat_messages')
  }
}

module.exports = ChatMessagesSchema
