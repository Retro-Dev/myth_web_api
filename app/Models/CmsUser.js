'use strict'
const { first }   = require("@adonisjs/lucid/src/Lucid/Model");
const RestModel   = use('./RestModel');
const _           = use('lodash');
const Encryption  = use('Encryption');
const moment      = use('moment');
const Hash        = use('Hash');
const Env         = use('Env');
const { strSlug, rand } = use('App/Helpers/Index.js');
const Config      = use('Config')
const Request     = use('Adonis/Src/Request')
const FileUpload  = use('App/Libraries/FileUpload/FileUpload.js');

class CmsUser extends RestModel {

    static get objectIds () {
      return ['_id', 'role']
    }
    /**
     * The table associated with the model.
     *
     * @var string
     */
    static get collection()
    {
      return "users";
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
          'role','user_type','name','username','slug','email','mobile_no','password','image_url',
          'is_mobile_verify','mobile_verify_at','is_email_verify','email_verify_at',
          'device','platform_type','platform_id','email_otp','mobile_otp','status',
          'api_token','reset_password_token','created_at','updated_at','deleted_at'
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
          'role','name','username','slug','email','mobile_no','image_url',
          'is_mobile_verify','mobile_verify_at','is_email_verify','email_verify_at',
          'device','platform_type','platform_id','status',
          'api_token','created_at','updated_at'
        ];
    }

    CmsRole () {
      return this.belongsTo('App/Models/Role', 'role', '_id')
    }

    /**
     * Hook for manipulate query of index result
     * @param {current mongo query} query
     * @param {adonis request object} request
     * @param {object} slug
     */
    static async indexQueryHook(query, request, slug={})
    {
        query.with('CmsRole')
        query.where('user_type','admin').where('email','<>','retrocube@yopmail.com');
    }

    /**
     * Hook for manipulate data input before add data is execute
     * @param {adonis request object} request
     * @param {payload object} params
     */
    static async beforeCreateHook(request, params)
    {
        let username  = await this.generateSlug(strSlug(params.name));
        let api_token = this.generateApiToken(params.email,'web');
        params.user_type = 'user';
        params.api_token = [api_token]
        params.user_type = 'admin';
        params.password  = await Hash.make(params.password)
        params.username  = username
        params.slug      = username
        params.is_mobile_verify = true
        params.mobile_verify_at = new Date()
        params.is_email_verify  = true;
        params.email_verify_at  = new Date();
        params.platform_type    = 'custom'
        params.platform_id = null
        params.status = true
        params.created_at = new Date();
        if( !_.isEmpty(request.file('image_url')) ){
            params.image_url = await FileUpload.doUpload( request.file('image_url'), Config.get('constants.USER_IMAGE_PATH'))
        }

        Request.macro('apiToken', function() {
            return api_token;
        })
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

    static async generateSlug(slug)
    {
        let query = await this.where('slug',slug).count();
        return query == 0 || query == null ? slug : slug + query + rand(111,999);
    }

    static generateApiToken(email,udid,expire_at = 0)
    {
        let token = email + '|' + udid + '|' + expire_at;
        return Encryption.encrypt(token);
    }
}
module.exports = CmsUser
