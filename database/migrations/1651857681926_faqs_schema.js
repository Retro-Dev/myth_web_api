'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FaqsSchema extends Schema {
  up () {
    this.create('faqs', (table) => {
      table.increments()
      table.string('slug',200).notNullable().unique();
      table.text('question').notNullable()
      table.text('answer').notNullable()
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('faqs')
  }
}

module.exports = FaqsSchema
