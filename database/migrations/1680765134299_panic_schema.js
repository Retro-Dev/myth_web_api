'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PanicSchema extends Schema {
  up () {
    this.create('panics', (table) => {
      table.increments()
      table.timestamps()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION');
      table.text('file_url').nullable()
      table.string('slug',150).notNullable().unique()
      table.enu('is_end',['1','0']).notNullable().defaultTo('0')
      table.text('thumbnail_url').nullable()
      table.integer('total_live_viewers').notNullable().defaultTo(0)
      table.bigInteger ('start_panic_time_ms').notNullable().defaultTo(0)
      table.bigInteger('end_panic_time_ms').notNullable().defaultTo(0)
      table.bigInteger('panic_duration_ms').notNullable().defaultTo(0)
      table.string('latitude',100).notNullable()
      table.string('longitude',100).notNullable()
      table.string('address',5000).nullable()
      table.string('agora_token').notNullable()
      table.text('resource_id', 1000).nullable()
      table.string('uid').nullable()
      table.string('sid').nullable()
      table.string('channel_name').nullable()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('panics')
  }
}

module.exports = PanicSchema
