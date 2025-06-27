"use strict";

const Model  = use('Model');
const Config = use("Config");
const _      = use("lodash");
const moment = use("moment");

class RestModel extends Model {

  /**
   *
   * @param request
   * @param params
   * @returns {Promise<*>}
   */
   static async createRecord(request, params)
   {
      //before create hook
      if (_.isFunction(this.loadHook(request).beforeCreateHook)) {
          await this.loadHook(request).beforeCreateHook(request, params);
      }
      //insert record
      var record = await this.create(params);
      //after create hook
      if (_.isFunction(this.loadHook(request).afterCreateHook)) {
          await this.loadHook(request).afterCreateHook(record, request, params);
      }
      //get record by id
      var record = await this.getRecordBySlug(request, record.slug);

      return record;
  }

  static async getRecords(request, params = {})
  {
      let query = this.query()
      .select(this.showColumns())
      .whereNull(this.table + ".deleted_at");
      //query hook
      if (_.isFunction(this.loadHook(request).indexQueryHook)) {
          await this.loadHook(request).indexQueryHook(query, request, params);
      }
      let record_limit = _.isEmpty(params.limit) ? Config.get("constants.pagination_limit") : parseInt(params.limit);
      query = await query.paginate(_.isEmpty(params.page) ? 1 : params.page, record_limit);
      return query.toJSON();

  }

  /**
     *
     * @param request
     * @param slug
     * @returns {Promise<*>}
     */
   static async getRecordBySlug(request, slug)
   {
      let query = this.query()
        .select(this.showColumns())
        .whereNull(this.table + ".deleted_at");
      //query hook
      if (_.isFunction(this.loadHook(request).indexQueryHook)) {
          await this.loadHook(request).indexQueryHook(query, request, slug);
      }
      //get record
      let record = await query.where(this.table + ".slug", slug).first();
      if (!_.isEmpty(record)) {
          return record.toJSON();
      } else {
          return {};
      }
  }

  /**
     *
     * @param request
     * @param params
     * @param id
     * @returns {Promise<*>}
     */
   static async updateRecord(request, params, slug) {
      let record;
      //before update hook
      if (_.isFunction(this.loadHook(request).beforeEditHook)) {
          await this.loadHook(request).beforeEditHook(request, params, slug);
      }
      //update record
      if (!_.isEmpty(params) ) {
          record = await this.query().where(this.table + ".slug", slug).update(params);
      }
      //After  update hook
      if (_.isFunction(this.loadHook(request).afterEditHook)) {
          await this.loadHook(request).afterEditHook(record,request, params);
      }

      record = await this.getRecordBySlug(request, slug);
      return record;
  }

  /**
   *
   * @param request
   * @param params
   * @param id
   * @returns {Promise<void>}
   */
  static async deleteRecord(request, params, slug) {
      //before delete hook
      let slug_arr = [];
      if (_.isFunction(this.loadHook(request).beforeDeleteHook)) {
          await this.loadHook(request).beforeDeleteHook(request, params, slug);
      }
      if( slug == 'delete-record' ){
        slug_arr = params.slug
      } else {
        slug_arr.push(slug);
      }
      //check soft delete
      if (_.isFunction(this.softdelete)) {
          if (this.softdelete()) {
              await this.query()
                  .whereIn(this.table + ".slug", slug_arr)
                  .update({ deleted_at: moment().format("YYYY-MM-DD H:mm:ss") });
          } else {
              await this.query().whereIn(this.table + ".slug", slug_arr).delete();
          }
      } else {
          await this.query().whereIn(this.table + ".slug", slug_arr).delete();
      }
      //after delete hook
      if (_.isFunction(this.loadHook(request).afterDeleteHook)) {
          await this.loadHook(request).afterDeleteHook(request, params, slug);
      }
      return true;
  }

  static async dataTableRecords(request)
  {
      let data   = [];
      let params = request.all();
      let query  = this.query()
                    .select(this.showColumns())
                    .whereNull(this.table + ".deleted_at");

      if(_.isFunction(this.loadHook(request).datatable_query_hook))
          await this.loadHook(request).datatable_query_hook(query,request);

      data['total_record'] = await query.getCount();
      query = query.limit(parseInt(params['length'])).offset(parseInt(params['start'])).orderBy(this.table + '.id','desc');
      query = await query.fetch();
      data['records'] = !_.isEmpty(query) ? query.toJSON() : [];
      return data;
  }

  static loadHook(request)
  {
      let url = request.url()
      let hookName = this.prototype.constructor.name + 'Hook';
      if( url.includes('api') ){
        return use(`App/Models/Hooks/Api/${hookName}`);
      } else {
        return use(`App/Models/Hooks/Admin/${hookName}`);
      }
  }
}
module.exports = RestModel;
