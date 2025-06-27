'use strict'

const { first } = require("@adonisjs/lucid/src/Lucid/Model");
const RestModel  = use('./RestModel');
const _          = use('lodash');

class Contact extends RestModel {

    static boot ()
    {
        super.boot()
        this.addHook('beforeCreate', async (userInstance) => {

        })
    }

    /**
     * The table associated with the model.
     *
     * @var string
     */
    static get table()
    {
      return "contacts";
    }

    /**
     * The field name used to set the creation timestamp (return null to disable):
     */
    static get createdAtColumn () {
      return 'created_at';
    }

    /**
     * The field name used to set the creation timestamp (return null to disable):
     */
    static get updatedAtColumn () {
      return 'updated_at';
    }

    static softdelete()
    {
        return true;
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    static getFields()
    {
        return ['user_id'];
    }

    /**
     * omit fields from database results
     */
    static get hidden ()
    {
      return []
    }

    /**
     * mention column for select query
     */
    static showColumns()
    {
        return ['*'];
    }

    /**
     * omit fields from update request
     */
    static exceptUpdateField()
    {
        return [];
    }

    /**
     * Hook for manipulate query of index result
     * @param {current mongo query} query
     * @param {adonis request object} request
     * @param {object} slug
     */
    static async indexQueryHook(query, request, slug={})
    {

    }

    /**
     * Hook for manipulate data input before add data is execute
     * @param {adonis request object} request
     * @param {payload object} params
     */
    static async beforeCreateHook(request, params)
    {

    }

    /**
     * Hook for execute command after add public static function called
     * @param {saved record object} record
     * @param {adonis request object} request
     * @param {payload object} params
     */
    static async afterCreateHook(record, request, params)
    {

    }

    /**
     * Hook for manipulate data input before update data is execute
     * @param {adonis request object} request
     * @param {payload object} params
     * @param {string} slug
     */
    static async beforeEditHook(request, params, slug)
    {
        // let exceptUpdateField = this.exceptUpdateField();
        // exceptUpdateField.filter(exceptField => {
        //     delete params[exceptField];
        // });
    }

    /**
     * Hook for execute command after edit
     * @param {updated record object} record
     * @param {adonis request object} request
     * @param {payload object} params
     */
    static async afterEditHook(record, request, params)
    {

    }

    /**
     * Hook for execute command before delete
     * @param {adonis request object} request
     * @param {payload object} params
     * @param {string} slug
     */
    static async beforeDeleteHook(request, params, slug)
    {

    }

    /**
     * Hook for execute command after delete
     * @param {adonis request object} request
     * @param {payload object} params
     * @param {string} slug
     */
    static async afterDeleteHook(request, params, slug)
    {

    }

    /**
     * Hook for manipulate query of datatable result
     * @param {current mongo query} query
     * @param {adonis request object} request
     */
    static async datatable_query_hook(query,request)
    {

    }

    static async getContacts(condition)
    {
      let records = await this.query().where(condition).with('user').with('user_2').whereNull('deleted_at').fetch()
      return records ? records.toJSON() : []
    }

    static async getContact(condition)
    {
      let records = await this.query().where(condition).with('user').with('user_2', function (builder) {
        builder.with('api_token', function (builder) {
          builder.orderBy('created_at', 'desc')
        })
      }).whereNull('deleted_at').first()
      return records ? records.toJSON() : null
    }

    // static async getContactWToken(condition) {
    //   let user = await this.query().where(condition).with('user_2', function (builder) {
    //     builder.whereHas('api_token').with('api_token',  function (builder) {
    //       builder.orderBy('created_at', 'desc')
    //   })
    //   }).whereNull('deleted_at').fetch()
    //   user = user ? user.toJSON() : []
    //   return user
    // }
    static async getContactWToken(condition) {
      let user = await this.query().where(condition).with('user', function (builder) {
        builder.whereHas('api_token').with('api_token',  function (builder) {
          builder.orderBy('created_at', 'desc')
      })
      }).with('user_2', function (builder) {
        builder.whereHas('api_token').with('api_token',  function (builder) {
          builder.orderBy('created_at', 'desc')
      })
      }).whereNull('deleted_at').fetch()
      user = user ? user.toJSON() : []
      return user
    }

    static async getUsers(condition) {
      let user = await this.query().where(condition).with('user', function (builder) {
        builder.whereHas('api_token').with('api_token',  function (builder) {
          builder.orderBy('created_at', 'desc')
      })
      }).whereNull('deleted_at').fetch()
      user = user ? user.toJSON() : []
      return user
    }

    static async getCount(user_id,user_id_2) {
      let count = await this.query().where('user_id',user_id).where('user_id_2', user_id_2).whereNull('deleted_at').count()
      let total = count[0]['count(*)']
       
      return total
    }
    
    user() {
      return this.belongsTo('App/Models/User', 'user_id', 'id')
    }

    user_2() {
      return this.belongsTo('App/Models/User', 'user_id_2', 'id')
    }
}
module.exports = Contact
