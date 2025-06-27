'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MediaSchema extends Schema {
  up () {
    this.create('media', (table) => {
      table.increments()
      table.string('module',100).notNullable().defaultTo('')
      table.integer('module_id').notNullable().defaultTo(0)
      table.enu('is_admin',['1','0']).notNullable().defaultTo(1) // 1 panic video supposed to be of panic creator
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION');
      table.string('filename',200).notNullable()
      table.string('original_name',200).nullable()
      table.double('duration_ms').notNullable().defaultTo(0)
      table.text('file_url').notNullable()
      table.string('file_url_blur',200).nullable()
      table.text('thumbnail_url').nullable()
      table.string('mime_type').nullable()
      table.string('slug',150).notNullable().unique()
      table.string('file_type')
      table.string('driver',50).notNullable().defaultTo('local')
      table.enu('media_type',['public','private']).notNullable().defaultTo('public');
      table.text('meta').nullable()
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('media')
  }
}

module.exports = MediaSchema
