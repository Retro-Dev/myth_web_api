'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserApiTokensSchema extends Schema {
  up () {
    this.create('user_api_tokens', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION');
      table.text('api_token').notNullable()
      table.string('device_type',100).nullable()
      table.string('device_token',500).nullable()
      table.string('platform_type',100).nullable()
      table.string('platform_id',255).nullable()
      table.string('ip_address',100).nullable()
      table.text('user_agent').nullable()
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('user_api_tokens')
  }
}

module.exports = UserApiTokensSchema
