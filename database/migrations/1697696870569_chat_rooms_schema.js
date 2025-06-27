'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ChatRoomsSchema extends Schema {
  up () {
    this.create('chat_rooms', (table) => {
      table.increments()
      table.string('identifier', 200).notNullable();
      table.integer('created_by').notNullable();
      table.string('title', 200).nullable();
      table.string('slug', 200).nullable();
      table.text('image_url');
      table.text('description');
      table.integer('status').notNullable().defaultTo(1);
      table.enum('type', ['single', 'group']).notNullable();
      table.integer('member_limit').notNullable().defaultTo(0);
      table.tinyint('is_anonymous').defaultTo(0);
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('chat_rooms')
  }
}

module.exports = ChatRoomsSchema
