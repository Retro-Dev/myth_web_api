'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NotificationSettingSchema extends Schema {
  up () {
    this.create('notification_settings', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION');
      table.string('meta_key',100).notNullable()
      table.text('meta_value').notNullable()
      table.timestamps()
      table.timestamp('deleted_at').nullable()

      table.index('meta_key')
    })
  }

  down () {
    this.drop('notification_settings')
  }
}

module.exports = NotificationSettingSchema
