'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ContactSchema extends Schema {
  up () {
    this.create('contacts', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION'); // current user
      table.integer('user_id_2').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION'); // emergency user
      table.string('slug',150).notNullable().unique()
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('contacts')
  }
}

module.exports = ContactSchema
