'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UsersSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.integer('user_group_id').unsigned().references('id').inTable('user_groups').onDelete('CASCADE').onUpdate('NO ACTION');
      table.enu('user_type',['admin','user']).notNullable().defaultTo('user')
      table.string('name',150).notNullable()
      table.string('pseudo_name',150).nullable()
      table.enu('is_pseudo_name',['1','0']).notNullable().defaultTo('0')
      table.enu('is_panic',['1','0']).notNullable().defaultTo('0')
      table.integer('radius_mi').defaultTo(5) // radius is in miles
      table.string('subscription_expiry_date').nullable() // 0: unsubscribe 1: subscribe
      table.enu('is_subscribed',['1','0']).notNullable().defaultTo('0') // 0: unsubscribe 1: subscribe
      table.string('username',150).notNullable().unique()
      table.string('slug',150).notNullable().unique()
      table.string('email',150).nullable().unique()
      table.string('mobile_no',100).nullable().unique()
      table.string('password',255).notNullable()
      table.text('image_url',100).nullable()
      table.string('blur_image',200).nullable()
      table.enu('status',['1','0']).notNullable().defaultTo('1')
      // table.enu('in_app_message',['1','0']).notNullable().defaultTo('0') // 02
      // table.enu('live_stream',['1','0']).notNullable().defaultTo('0') // 01
      // table.enu('no_ads',['1','0']).notNullable().defaultTo('0')
      table.enu('is_email_verify',['1','0']).notNullable().defaultTo('0')
      table.timestamp('email_verify_at').nullable()
      table.enu('is_mobile_verify',['1','0']).nullable().defaultTo('1')
      table.enu('subscription_status',['1','0']).nullable().defaultTo('0') // 0:unsubscribed 1:subscribed
      table.timestamp('mobile_verify_at').nullable()
      table.enu('platform_type',['custom','facebook','google','apple']).defaultTo('custom')
      table.string('platform_id',255).nullable()
      table.string('country',100).nullable()
      table.string('city',100).nullable()
      table.string('state',100).nullable()
      table.string('zipcode',100).nullable()
      table.string('address',5000).nullable()
      table.string('latitude',100).nullable()
      table.string('longitude',100).nullable()
      table.enu('online_status',['1','0']).notNullable().defaultTo('0')
      table.enu('is_notification',['1','0']).notNullable().defaultTo('1')
      table.string('mobile_otp',100).nullable()
      table.string('email_otp',100).nullable()
      table.string('socket',100).nullable()
      table.string('joined_panic_room',500).nullable()
      table.timestamp('trial_expiration_date').nullable()
      table.timestamps()
      table.timestamp('deleted_at').nullable()

      table.index('name')

    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UsersSchema
