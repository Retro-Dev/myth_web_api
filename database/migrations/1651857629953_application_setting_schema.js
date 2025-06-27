'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ApplicationSettingSchema extends Schema {
  up () {
    this.create('application_settings', (table) => {
      table.increments()
      table.string('identifier',200);
      table.string('meta_key',200);
      table.text('value');
      table.enu('is_file',['1','0']).notNullable().defaultTo('0');
      table.timestamps()
      table.timestamp('deleted_at').nullable()

      table.index('identifier');
      table.index('meta_key');

    })
  }

  down () {
    this.drop('application_settings')
  }
}

module.exports = ApplicationSettingSchema
