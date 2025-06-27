'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MailTemplateSchema extends Schema {
  up () {
    this.create('mail_templates', (table) => {
      table.increments()
      table.string('identifier',100);
      table.string('subject',200);
      table.text('body',100).notNullable();
      table.text('wildcard',100).notNullable();
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('mail_templates')
  }
}

module.exports = MailTemplateSchema
