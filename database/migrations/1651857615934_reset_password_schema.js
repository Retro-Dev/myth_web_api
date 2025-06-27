'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ResetPasswordSchema extends Schema {
  up () {
    this.create('reset_passwords', (table) => {
      table.increments()
      table.string('email',150);
      table.string('token',255);
      table.timestamps()
      table.timestamp('deleted_at').nullable()

      table.index('email');

    })
  }

  down () {
    this.drop('reset_passwords')
  }
}

module.exports = ResetPasswordSchema
