'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ChatRoomUsersSchema extends Schema {
  up () {
    this.create('chat_room_users', (table) => {
      table.increments()
      table.integer('chat_room_id').notNullable();
      table.integer('user_id').notNullable();
      table.integer('is_owner').notNullable().defaultTo(0);
      table.integer('last_chat_message_id').defaultTo(0);
      table.datetime('last_message_timestamp').nullable();
      table.integer('unread_message_counts').defaultTo(0);
      table.tinyint('is_anonymous').defaultTo(0);
      table.integer('is_leave').defaultTo(0);
      table.boolean('is_pin').notNullable().defaultTo(0);
      table.boolean('is_mute').notNullable().defaultTo(0);
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('chat_room_users')
  }
}

module.exports = ChatRoomUsersSchema
