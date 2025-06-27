'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DirectorySchema extends Schema {
  up () {
    this.create('directories', (table) => {
      table.increments()
      table.integer('directory_category_id').unsigned().references('id').inTable('directory_categories').onDelete('CASCADE').onUpdate('NO ACTION');
      table.string('name',150).notNullable()
      table.string('department',150).notNullable()
      table.string('badge_no',150).notNullable()
      table.text('image_url').notNullable()
      table.decimal('rating',2,1).notNullable().defaultTo(0.0)
      table.enu('status',['1','0']).notNullable().defaultTo('1')
      table.integer('total_reviews').notNullable().defaultTo(0)
      table.decimal('rating_avg', 2, 1).notNullable().defaultTo(0)
      table.string('slug',150).notNullable().unique()
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('directories')
  }
}

module.exports = DirectorySchema
