'use strict'

const { first }   = use("@adonisjs/lucid/src/Lucid/Model");
const RestModel   = use('./RestModel');
const _           = use('lodash');
const { strSlug } = use('App/Helpers/Index.js');

class UserGroup extends RestModel
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    static get table()
    {
      return "user_groups";
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
        return [
          'title','slug','description','type','is_super_admin','status','created_at',
          'updated_at','deleted_at'
        ];
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
        return [
          'title','slug','description','type','is_super_admin','status','created_at'
        ];
    }

    /**
     * Hook for manipulate query of index result
     * @param {current mongo query} query
     * @param {adonis request object} request
     * @param {object} slug
     */
    static async indexQueryHook(query, request, slug={})
    {
        let params = request.all();
        if( !_.isEmpty(params.keyword) ){
          let keyword = params.keyword
          query.where({ $or: [ { title: { $regex: keyword, $options: 'i' } }, { is_super_admin: params.keyword } ] });
        }
        query.where({ slug: { $nin: [ 'super-admin', 'app-user' ] } });
        query.orderBy('created_at','DESC')
    }

    /**
     * Hook for manipulate data input before add data is execute
     * @param {adonis request object} request
     * @param {payload object} params
     */
    static async beforeCreateHook(request, params)
    {
        let request_params = request.all();
        params.type        = 'admin';
        params.slug        = strSlug(params.title);
        params.is_super_admin = params.is_super_admin == '0' ? false : true;
        params.status      = true;
        params.created_at  = new Date();
        if( !_.isEmpty(request_params.module_id) ){
          let permission_arr = [];
          var modulePermissions = request_params.module_id;
          for (var property in modulePermissions) {
            let obj = {
               module_id: property,
               is_add: !_.isEmpty(modulePermissions[property].is_add) ? modulePermissions[property].is_add : 0,
               is_view: !_.isEmpty(modulePermissions[property].is_view) ? modulePermissions[property].is_view : 0,
               is_delete: !_.isEmpty(modulePermissions[property].is_delete) ? modulePermissions[property].is_delete : 0,
               is_update: !_.isEmpty(modulePermissions[property].is_update) ? modulePermissions[property].is_update : 0,
            }
            permission_arr.push(obj);
          }
          params.module_permission = permission_arr;
        }
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
        let request_params = request.all();
        params.updated_at  = new Date();
        if( !_.isEmpty(request_params.module_id) ){
          let permission_arr = [];
          var modulePermissions = request_params.module_id;
          for (var property in modulePermissions) {
            let obj = {
              module_id: property,
              is_add: !_.isEmpty(modulePermissions[property].is_add) ? modulePermissions[property].is_add : 0,
              is_view: !_.isEmpty(modulePermissions[property].is_view) ? modulePermissions[property].is_view : 0,
              is_delete: !_.isEmpty(modulePermissions[property].is_delete) ? modulePermissions[property].is_delete : 0,
              is_update: !_.isEmpty(modulePermissions[property].is_update) ? modulePermissions[property].is_update : 0,
            }
            permission_arr.push(obj);
          }
          params.module_permission = permission_arr;
        }
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
}
module.exports = UserGroup
