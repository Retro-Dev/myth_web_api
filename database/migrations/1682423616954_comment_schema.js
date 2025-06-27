'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CommentSchema extends Schema {
  up () {
    this.create('comments', (table) => {
      table.increments()
      table.text('comment').nullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION');
      table.integer('post_id').unsigned().references('id').inTable('posts').onDelete('CASCADE').onUpdate('NO ACTION');
      table.string('slug',150).notNullable().unique()      
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('comments')
  }
}

module.exports = CommentSchema
