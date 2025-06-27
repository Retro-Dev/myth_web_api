'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ContentManagementSchema extends Schema {
  up () {
    this.create('content_managements', (table) => {
      table.increments()
      table.string('title',150).notNullable();
      table.string('slug',150).notNullable().unique()
      table.text('content')
      table.enu('status',['1','0']).defaultTo('1')
      table.timestamps()
      table.timestamp('deleted_at').nullable()

      table.index('slug')
    })
  }

  down () {
    this.drop('content_managements')
  }
}

module.exports = ContentManagementSchema
