'use strict'

const { first } = require("@adonisjs/lucid/src/Lucid/Model");
const RestModel  = use('./RestModel');
const _          = use('lodash');

class CmsModule extends RestModel {

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
    static get collection()
    {
      return "cms_modules";
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
          'parent_id', 'name', 'route_path', 'icon', 'status', 'sort_order', 'created_at',
          'updated_at', 'deleted_at'
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
        'parent_id', 'name', 'route_path', 'icon', 'status', 'sort_order', 'created_at',
        'updated_at', 'deleted_at'
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
     *
     * @param {string} role_slug
     * @param {string} module
     * @param {string} action | GET, POST, PUT, DELETE
     */
    static async checkModulePermission(user, module, action)
    {
        if( user.cmsRole.slug == 'super-admin' )
          return true;

        console.log('user',user);
    }

    /**
     * Get Cms Module By Role
     * @param {string} role_slug
     */
    static async getCmsModules(role_slug = 'super-admin', module_permission = [], params = {})
    {
        let modules = [];
        let query = this.query();
        let records =  await query.orderBy('sort_order','ASC').where({status:true}).fetch()
            records = _.isEmpty(records) ? [] : records.toJSON();

        if( role_slug != 'super-admin' ) {
          if( !_.isEmpty(module_permission) ){
            for( var m=0; m < module_permission.length; m++ ){
                records.filter( (record) => {
                    if( record._id == module_permission[m].module_id ){
                      record.is_add = module_permission[m].is_add;
                      record.is_view = module_permission[m].is_view;
                      record.is_update = module_permission[m].is_update;
                      record.is_delete = module_permission[m].is_delete;
                      modules.push(record);
                    }
                })
            }
            return modules;
          } else {
             return [];
          }
        }
        return records;
    }

    /**
     * Get Cms module With Permission
     * @param {array} role_permissions
     *
     */
    static async getModulesWithPermission(role_permissions)
    {
        let modules = await this.getCmsModules();
        if( !_.isEmpty(role_permissions) ){
          if( !_.isEmpty(modules) ){
              for( var m=0; m < modules.length; m++ ){
                  let permission = role_permissions.filter( (data) => {
                      return data.module_id == modules[m]._id;
                  })
                  modules[m].is_add    = _.isEmpty(permission) ? '0' : !_.isEmpty(permission[0].is_add) && permission[0].is_add == '1' ? '1' : '0';
                  modules[m].is_view   = _.isEmpty(permission) ? '0' : !_.isEmpty(permission[0].is_view) && permission[0].is_view == '1' ? '1' : '0';
                  modules[m].is_update = _.isEmpty(permission) ? '0' : !_.isEmpty(permission[0].is_update) && permission[0].is_update == '1' ? '1' : '0';
                  modules[m].is_delete = _.isEmpty(permission) ? '0' : !_.isEmpty(permission[0].is_delete) && permission[0].is_delete == '1' ? '1' : '0';
              }
          }
        } else {
            for( var m=0; m < modules.length; m++ ){
                modules[m].is_add    = '0';
                modules[m].is_view   = '0';
                modules[m].is_update = '0';
                modules[m].is_delete = '0';
            }
        }
        return modules;
    }

    /**
     *
     * @param {sring} slug
     */
    static async getModuleBySlug(slug)
    {
        let query = this.query().where('slug',slug).first();
        return query;
    }
}
module.exports = CmsModule
