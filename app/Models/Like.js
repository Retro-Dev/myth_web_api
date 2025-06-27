'use strict'

const { first } = require("@adonisjs/lucid/src/Lucid/Model");
const RestModel = use('./RestModel');
const _ = use('lodash');

class Like extends RestModel {

  static boot() {
    super.boot()
    this.addHook('beforeCreate', async (userInstance) => {

    })
  }

  /**
   * The table associated with the model.
   *
   * @var string
   */
  static get table() {
    return "likes";
  }

  /**
   * The field name used to set the creation timestamp (return null to disable):
   */
  static get createdAtColumn() {
    return 'created_at';
  }

  /**
   * The field name used to set the creation timestamp (return null to disable):
   */
  static get updatedAtColumn() {
    return 'updated_at';
  }

  static softdelete() {
    return false;
  }

  /**
   * The attributes that are mass assignable.
   *
   * @var array
   */
  static getFields() {
    return ['is_like', 'post_id'];
  }

  /**
   * omit fields from database results
   */
  static get hidden() {
    return []
  }

  /**
   * mention column for select query
   */
  static showColumns() {
    return ['id', 'is_like', 'slug', 'post_id', 'user_id','created_at', 'updated_at'];
  }

  /**
   * omit fields from update request
   */
  static exceptUpdateField() {
    return [];
  }

  /**
   * Hook for manipulate query of index result
   * @param {current mongo query} query
   * @param {adonis request object} request
   * @param {object} slug
   */
  static async indexQueryHook(query, request, slug = {}) {

  }

  /**
   * Hook for manipulate data input before add data is execute
   * @param {adonis request object} request
   * @param {payload object} params
   */
  static async beforeCreateHook(request, params) {

  }

  /**
   * Hook for execute command after add public static function called
   * @param {saved record object} record
   * @param {adonis request object} request
   * @param {payload object} params
   */
  static async afterCreateHook(record, request, params) {

  }

  /**
   * Hook for manipulate data input before update data is execute
   * @param {adonis request object} request
   * @param {payload object} params
   * @param {string} slug
   */
  static async beforeEditHook(request, params, slug) {
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
  static async afterEditHook(record, request, params) {

  }

  /**
   * Hook for execute command before delete
   * @param {adonis request object} request
   * @param {payload object} params
   * @param {string} slug
   */
  static async beforeDeleteHook(request, params, slug) {

  }

  /**
   * Hook for execute command after delete
   * @param {adonis request object} request
   * @param {payload object} params
   * @param {string} slug
   */
  static async afterDeleteHook(request, params, slug) {

  }

  /**
   * Hook for manipulate query of datatable result
   * @param {current mongo query} query
   * @param {adonis request object} request
   */
  static async datatable_query_hook(query, request) {

  }

  static async getLikeUserPostRecord(condition) {
    let record = await this.query().where(condition).with('user').with('post', function(pst){
      pst.with('is_like',function(builder){
        builder.where('is_like','1').where('user_id', condition.user_id)
    }).with('user').with('media').with('like', function (builder) {
        builder.with('user').where('is_like', '1').orderBy('created_at', 'desc')
      })
    }).first()
    return record? record.toJSON(): null
  }

  static async getLikeRecord(condition) {
    let query = this.query()
    let record = await query.where(condition).first()
    return record? record.toJSON(): null
  }

  static async createLikeRecord(data) {
    let record = await this.create(data);
    record = record.toJSON()
    return record
  }

  static async getLikeCount(condition) {
    let count = await this.query().where(condition).count()
    return count[0]['count(*)']
  }

  static async updateLikeRecord(condition, update) {
    await this.query().where(condition).update(update)
   }

  user() {
    return this.belongsTo('App/Models/User', 'user_id', 'id')
  }
  post() {
    return this.belongsTo('App/Models/Post', 'post_id', 'id')
  }

  media() {
    return this.hasMany('App/Models/Media', 'id', 'module_id')
  }
}
module.exports = Like
