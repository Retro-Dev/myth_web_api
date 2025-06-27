'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OtherPanicDeletedBySchema extends Schema {
  up () {
    this.create('other_panic_deleted_by', (table) => {
      table.increments()
      table.integer('panic_id').unsigned().references('id').inTable('panics').onDelete('CASCADE').onUpdate('NO ACTION');
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION');
      table.string('slug',150).notNullable().unique()
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('other_panic_deleted_by')
  }
}

module.exports = OtherPanicDeletedBySchema
