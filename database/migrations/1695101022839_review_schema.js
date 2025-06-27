'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReviewSchema extends Schema {
  up () {
    this.create('reviews', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION');
      table.integer('directory_id').unsigned().references('id').inTable('directories').onDelete('CASCADE').onUpdate('NO ACTION');
      table.text('review',500).nullable()
      table.decimal('rate',2,1).notNullable().defaultTo(0);
      table.string('slug',150).notNullable().unique()
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('reviews')
  }
}

module.exports = ReviewSchema
