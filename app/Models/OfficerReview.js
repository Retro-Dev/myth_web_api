'use strict'

const { first } = require("@adonisjs/lucid/src/Lucid/Model");
const RestModel  = use('./RestModel');
const _          = use('lodash');

class OfficerReview extends RestModel {

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
      return "officer_reviews";
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
        return ['officer_id', 'rate', 'review'];
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

    static async calculateAvg(condition)    
    {
      let avg =  await this.query().where(condition).where('deleted_at', null).avg('rate as avg')
      return avg[0].avg
    }

    static async getCount(condition) {
      let count = await this.query().where(condition).whereNull('deleted_at').count()

      let total = count[0]['count(*)']
      return total
  }

    static async getReview(condition) {
      let record = await this.query().where(condition).first()
      record = record ? record.toJSON() : []
      return record
  }


  static async getAverageRating(condition) {
    let rating = await this.query().where(condition).whereNull('deleted_at').getSum("rate");
    let total = await this.query().where(condition).getCount();
    return (rating / total || 0);
  }

    user() {
      return this.belongsTo('App/Models/User', 'user_id', 'id')
    }

    policeOfficer() {
      return this.belongsTo('App/Models/PoliceOfficer', 'officer_id', 'id')
    }
}
module.exports = OfficerReview
