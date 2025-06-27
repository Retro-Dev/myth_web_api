'use strict'

const { first } = require("@adonisjs/lucid/src/Lucid/Model");
const RestModel  = use('./RestModel');
const _          = use('lodash');

class Panic extends RestModel {

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
      return "panics";
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
        return ['latitude', 'longitude'];
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
        return [];
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

    static async getPanic(condition){
      let record = await this.query().where(condition).with('user').orderBy('created_at', 'desc').first()
      return record? record.toJSON():[]
    }

    static async getPanicWMedia(condition, request){
      let record = await this.query().where(condition).with('user').with('media', function (builder) {
        builder.where('module', 'panic').where('user_id', request.user().id).whereNull('deleted_at')
    }).orderBy('created_at', 'desc').first()
      return record? record.toJSON():[]
    }

    static async createPanic(data)
    {
      let chat = await this.create(data)
      let record = await this.query().where({id: chat.id}).with('user').with('witness').first()
      record = record ? record.toJSON() : []
      return record
    }

    static async updatePanic(condition, data) {
      await this.query().where(condition).update(data);
      return true;
  }

  static async increaseTotalLiveViewers(id) {
    await this.query().where('id', id).increment('total_live_viewers', 1);
    let record = await this.query().where('id', id).first();
    return record.toJSON();
  }

  static async decreaseTotalLiveViewers(id) {
    await this.query().where('id', id).decrement('total_live_viewers', 1);
    let record = await this.query().where('id', id).first();
    return record.toJSON();
  }

    user() {
      return this.belongsTo('App/Models/User', 'user_id', 'id')
    }

    media() {
      return this.hasMany('App/Models/Media', 'id', 'module_id')
    }

    witness() {
      return this.hasMany('App/Models/Witness', 'id','panic_id')
    }

    otherPanics() {
      return this.hasMany('App/Models/DelOtherPanic', 'id','panic_id')
    }
}
module.exports = Panic
