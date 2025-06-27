'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CmsModulePermissionsSchema extends Schema {
  up () {
    this.create('cms_module_permissions', (table) => {
      table.increments()
      table.integer('user_group_id').unsigned().references('id').inTable('user_groups').onDelete('CASCADE').onUpdate('NO ACTION');
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION');
      table.integer('cms_module_id').unsigned().references('id').inTable('cms_modules').onDelete('CASCADE').onUpdate('NO ACTION');
      table.enu('is_add',['1','0']).defaultTo('0')
      table.enu('is_view',['1','0']).defaultTo('0')
      table.enu('is_update',['1','0']).defaultTo('0')
      table.enu('is_delete',['1','0']).defaultTo('0')
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('cms_module_permissions')
  }
}

module.exports = CmsModulePermissionsSchema
