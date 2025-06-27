'use strict'

const { first } = require("@adonisjs/lucid/src/Lucid/Model");
const RestModel = use('./RestModel');

class Media extends RestModel {

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
    return "media";
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
    return [];
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
    return [];
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

  static async updateMedia(condition, update) {
    await this.query().whereIn('id',condition.media_id).update(update)
  }

  static async getMedia(condition){
    let record = await this.query().where(condition).whereNull('deleted_at').fetch()
    return record? record.toJSON():[]
  }

  static async insertMedia(data){
    await this.query().insert(data)
    return true
  }

  user() {
    return this.belongsTo('App/Models/User', 'user_id', 'id')
  }

  panic() {
    return this.belongsTo('App/Models/Panic', 'module_id', 'id')
  }
}
module.exports = Media
