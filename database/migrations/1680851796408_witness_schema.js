'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WitnessSchema extends Schema {
  up () {
    this.create('witnesses', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION');
      table.integer('panic_id').unsigned().references('id').inTable('panics').onDelete('CASCADE').onUpdate('NO ACTION');
      table.string('slug',150).notNullable().unique()
      table.string('agora_token').notNullable()
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('witnesses')
  }
}

module.exports = WitnessSchema
