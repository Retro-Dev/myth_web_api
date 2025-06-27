'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DirectoryCategorySchema extends Schema {
  up () {
    this.create('directory_categories', (table) => {
      table.increments()
      table.string('name',150).notNullable()
      table.enu('status',[1,0]).notNullable().defaultTo('1')
      table.string('slug',150).notNullable().unique()
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('directory_categories')
  }
}

module.exports = DirectoryCategorySchema
