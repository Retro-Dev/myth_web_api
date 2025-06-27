'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CmsModulesSchema extends Schema {
  up () {
    this.create('cms_modules', (table) => {
      table.increments()
      table.integer('parent_id').defaultTo(0);
      table.string('name',100);
      table.string('route_name',100);
      table.string('icon',100);
      table.enu('status',['1','0']).defaultTo('1');
      table.decimal('sort_order');
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('cms_modules')
  }
}

module.exports = CmsModulesSchema
