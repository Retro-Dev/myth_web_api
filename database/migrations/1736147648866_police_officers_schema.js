'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PoliceOfficersSchema extends Schema {
  up () {
    this.create('police_officers', (table) => {
      table.increments()
      table.string('slug', 255).notNullable().unique()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('cascade')
      table.string('name', 255).notNullable()
      table.string('description', 255).notNullable()
      table.string('badge_no', 255).notNullable()
      table.string('city').notNullable()
      table.string('state').notNullable()
      table.string('status', 255).notNullable().defaultTo('1')
      table.string('image_url', 255).notNullable()
      // table.float('rating_avg', 8, 2).notNullable().defaultTo(0)
      // table.integer('total_reviews').notNullable().defaultTo(0)
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('police_officers')
  }
}

module.exports = PoliceOfficersSchema
