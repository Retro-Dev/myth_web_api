'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SubscriptionSchema extends Schema {
  up () {
    this.create('subscriptions', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION');
      table.string('subscription_id').nullable() // 0, 1
      table.string('title').notNullable().defaultTo('Monthly')
      table.string('original_transaction_id',150).notNullable()
      table.string('transaction_id',150).notNullable().unique()
      table.string('expiry_date').nullable()
      table.string('gateway_type').notNullable()
      table.text('gateway_response').notNullable()
      table.string('purchase_date').nullable()
      table.decimal('amount', 10, 2).defaultTo(0);
      table.string('slug',150).notNullable().unique()
      table.timestamps()
      table.timestamp('deleted_at').nullable()
    })
  }

  down () {
    this.drop('subscriptions')
  }
}

module.exports = SubscriptionSchema
