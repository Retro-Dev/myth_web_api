'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserGroupsSchema extends Schema {
  up () {
    this.create('user_groups', (table) => {
      table.increments()
      table.string('title',100).notNullable().unique()
      table.string('slug',100).notNullable().unique()
      table.string('description',255).nullable()
      table.enu('type',['admin','user']).notNullable().defaultTo('user')
      table.enu('is_super_admin',['1','0']).notNullable().defaultTo('0')
      table.enu('status',['1','0']).notNullable().defaultTo('1')
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('user_groups')
  }
}

module.exports = UserGroupsSchema
