'use strict'

const { first }  = require("@adonisjs/lucid/src/Lucid/Model");
const RestModel  = use('./RestModel');
const _          = use('lodash');
const FileUpload = use('App/Libraries/FileUpload/FileUpload.js');
const Config     = use('Config');
const {baseUrl} = use("App/Helpers/Index.js");

class ApplicationSetting extends RestModel {

    static boot ()
    {
        super.boot()
        this.addHook('beforeCreate', async (appInstance) => {

        })
    }

    /**
     * The table associated with the model.
     *
     * @var string
     */
    static get table()
    {
      return "application_settings";
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
          'identifier','meta_key','value','is_file','created_at','updated_at','deleted_at'
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
          'identifier','meta_key','value','is_file','created_at'
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
        let identifier = 'application_setting'
        //get setting
        let application_setting = await this.where('identifier',identifier).first();
        //delete old record
        await this.where('identifier',identifier).delete();

        params.identifier = identifier;
        params.slug       = identifier;
        if( !_.isEmpty(request.file('logo')) ){
            params.logo = await FileUpload.doUpload( request.file('logo'), Config.get('constants.APP_SETTING_IMAGE_PATH'))
        } else {
            params.logo = _.isEmpty(application_setting.logo) ? null : application_setting.logo;
        }
        if( !_.isEmpty(request.file('favicon')) ){
            params.favicon = await FileUpload.doUpload( request.file('favicon'), Config.get('constants.APP_SETTING_IMAGE_PATH'))
        } else {
            params.favicon = _.isEmpty(application_setting.favicon) ? null : application_setting.favicon;
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

    static async getApplicationSetting(params = [])
    {
        let data = {}
        let query   = await this.query().where('identifier',params.identifier).fetch();
        let records = !_.isEmpty(query) ? query.toJSON() : [];
        if( records.length > 0 ){
            for( var i=0; i < records.length; i++ ){
                if( records[i].is_file == 0 )
                  data[records[i].meta_key] = records[i].value
                else
                  data[records[i].meta_key] = baseUrl() + records[i].value
            }
        }
        return data;
    }
}
module.exports = ApplicationSetting
