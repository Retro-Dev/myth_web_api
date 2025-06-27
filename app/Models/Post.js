'use strict'

const { first } = require("@adonisjs/lucid/src/Lucid/Model");
const RestModel  = use('./RestModel');
const _          = use('lodash');
const Database = use('Database')

class Post extends RestModel {

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
      return "posts";
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
        return ['description'];
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

    static async updateTotalLikes(condition, data) {
      await this.query().where(condition).update(data)
    }
  
    // creating record in reports table
    static async createReportRecord(data) {
      await Database.table('reports').insert(data);
    }
  
    // retreiving record from reports table
    static async getReport(condition) {
        let query = Database.table('reports')
        .whereNull("deleted_at");
        query.with('post')
        await query.first()
      return query
    }

    static async updatePost(condition, data) {
      await this.query().where(condition).update(data)
    }

    media() {
      return this.hasMany('App/Models/Media', 'id', 'module_id')
    }

    user() {
      return this.belongsTo('App/Models/User', 'user_id', 'id')
    }

    like() {
      return this.hasMany('App/Models/Like', 'id', 'post_id')
    }

    comment() {
      return this.hasMany('App/Models/Comment', 'id', 'post_id')
    }

    post() {
      return this.belongsTo('App/Models/Post', 'post_id', 'id')
    }

    is_like() {
      return this.belongsTo('App/Models/Like', 'id', 'post_id')
    }
}
module.exports = Post
