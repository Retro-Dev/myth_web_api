'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WitnessStreamViewTimeSchema extends Schema {
  up () {
    this.create('witness_stream_view_times', (table) => {
      table.increments()
      table.string('slug',150).notNullable().unique()
      table.enu('is_watching',['1','0']).notNullable().defaultTo('1')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION');
      table.integer('panic_id').unsigned().references('id').inTable('panics').onDelete('CASCADE').onUpdate('NO ACTION');
      table.integer('witness_id').unsigned().references('id').inTable('witnesses').onDelete('CASCADE').onUpdate('NO ACTION');
      table.bigInteger('watch_start_time_ms').notNullable().defaultTo(0)
      table.bigInteger('watch_end_time_ms').notNullable().defaultTo(0)
      table.bigInteger('watch_duration_ms').notNullable().defaultTo(0)
      table.decimal('watch_duration_minutes', 10, 2).notNullable().defaultTo(0)
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('witness_stream_view_times')
  }
}

module.exports = WitnessStreamViewTimeSchema
