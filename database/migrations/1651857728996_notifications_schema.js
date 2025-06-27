'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NotificationsSchema extends Schema {
  up () {
    this.create('notifications', (table) => {
      table.increments()
      table.string('unique_id',200).unique().notNullable()
      table.string('identifier',200).notNullable();
      table.integer('actor_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION');
      table.integer('target_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION');
      table.string('module',100).notNullable()
      table.integer('module_id').notNullable()
      table.string('module_slug',100).notNullable()
      table.string('reference_module').nullable()
      table.integer('reference_id').nullable()
      table.string('reference_slug',100).nullable()
      table.string('title')
      table.text('description')
      table.text('web_redirect_link').nullable();
      table.enu('is_badge',['1','0']).notNullable().defaultTo('1')
      table.enu('is_read',['1','0']).notNullable().defaultTo('0')
      table.enu('is_view',['1','0']).notNullable().defaultTo('0')
      table.enu('is_star',['1','0']).notNullable().defaultTo('0')
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('notifications')
  }
}

module.exports = NotificationsSchema
