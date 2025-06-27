'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EventSchema extends Schema {
  up () {
    this.create('events', (table) => {
      table.increments()
      table.string('title',50).notNullable()
      table.enu('type',['2','1','0']).notNullable().defaultTo('0') // 0:event 1:ceremony 2:graduation
      table.string('address',100).notNullable()
      table.string('slug',150).notNullable().unique()
      table.string('date',100).notNullable()
      table.string('time',100).notNullable()
      table.enu('status',['1','0']).notNullable().defaultTo('1')
      table.text('file_url').notNullable()
      table.text('file_type').notNullable()
      table.text('thumbnail_url').nullable()
      table.text('description',100).notNullable()
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('events')
  }
}

module.exports = EventSchema
