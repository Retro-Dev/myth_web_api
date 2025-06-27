'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostSchema extends Schema {
  up () {
    this.create('posts', (table) => {
      table.increments()
      table.string('slug',150).notNullable().unique()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION');
      table.text('description',5000).nullable();
      table.enu('status',['1','0']).defaultTo('1');
      table.integer('total_like').notNullable().defaultTo(0);
      table.integer('total_comments').notNullable().defaultTo(0);
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('posts')
  }
}

module.exports = PostSchema
