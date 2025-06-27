'use strict'

const Controller = use('App/Controllers/Http/Controller');
const _ = use('lodash');
const Antl = use('Antl');

class CrudController extends Controller
{
    constructor(modal){
        super();
        this.modal        = this.loadModal(modal);
        this.__indexView  = '';
        this.__createView = '';
        this.__editView   = '';
        this.__detailView = '';
        this.routeName    = '';
        this.__is_error   = false;
        this.__success_listing_message = 'success_listing_message';
        this.__success_store_message   = 'success_store_message';
        this.__success_show_message    = 'success_show_message';
        this.__success_update_message  = 'success_update_message';
        this.__success_delete_message  = 'success_delete_message';
        this.__data = [];
    }

    async index({request,response,view})
    {
        this.request  = request;
        this.response = response;

        if (_.isFunction(this.beforeRenderIndexView)) {
            let hookResponse = await this.beforeRenderIndexView();
            if(  this.__is_error ){
                return hookResponse;
            }
        }

        return this.loadAdminView(view,this.__indexView,this.__data);
    }

    async ajaxListing({request,response})
    {
        let params      = request.all();
        let records     = {};
        let record_data = [];
        records.data    = [];
        //get records for datatable
        let dataTableRecord     = await this.modal.dataTableRecords(request);
        records.draw            = parseInt(params['draw']);
        records.recordsTotal    = _.isEmpty(dataTableRecord['total_record']) ? 0 : dataTableRecord['total_record'];
        records.recordsFiltered = _.isEmpty(dataTableRecord['total_record']) ? 0 : dataTableRecord['total_record'];
        // set data grid output
        if( dataTableRecord['records'].length > 0 ) {
            for( var i=0; i < dataTableRecord['records'].length; i++ ){
              if (_.isFunction(this.dataTableRecords)) {
                let datatable_data = await this.dataTableRecords(dataTableRecord['records'][i]);
                record_data.push(datatable_data);
              }
            }
            records.data = record_data
        }
        return response.json(records);
    }

    async create({request,response,view})
    {
        this.request  = request;
        this.response = response;

        if (_.isFunction(this.beforeRenderCreateView)) {
            let hookResponse = await this.beforeRenderCreateView();
            if(  this.__is_error ){
                return hookResponse;
            }
        }

        return this.loadAdminView(view,this.__createView,this.__data);
    }

    async store({request,response,session})
    {
        this.request  = request;
        this.response = response;
        //check validation
        if (_.isFunction(this.validation)) {
            let validator = await this.validation("store");
            if (!_.isEmpty(validator) && validator.fails()) {
                let errorMessages = await this.webValidateRequestParams(validator)
                session.withErrors({errors: errorMessages }).flashAll()
                response.redirect('back')
                return;
            }
        }
        //load controller before hook
        if (_.isFunction(this.beforeStoreLoadModel)) {
            let hookResponse = await this.beforeStoreLoadModel();
            if(  this.__is_error ){
                return hookResponse;
            }
        }
        //create record
        let record = await this.modal.createRecord(request,request.only(this.modal.getFields()));
        //load controller after hook
        if (_.isFunction(this.afterStoreLoadModel)) {
            var afterHookResponse = await this.afterStoreLoadModel(record);
            if ( typeof afterHookResponse != 'undefined' ) {
              record = afterHookResponse;
            }
        }
        session.flash({success: Antl.formatMessage(`messages.${this.__success_store_message}`) });
        response.route( this.routeName + '.index');
        return;
    }

    async edit({request, response, view, params, session})
    {
        this.request  = request;
        this.response = response;
        this.params   = params;
        let record = await this.modal.getRecordBySlug(request, params.id);
        if( _.isEmpty(record) ){
           session.withErrors({error: Antl.formatMessage('messages.invalid_request')  }).flashAll()
           response.route( this.routeName + '.index' );
        }
        if (_.isFunction(this.beforeRenderEditView)) {
            let hookResponse = await this.beforeRenderEditView(record);
            if(  this.__is_error ){
                return hookResponse;
            }
        }
        this.__data['record'] = record;
        return this.loadAdminView(view,this.__editView,this.__data);
    }

    async update({request, response, session})
    {
        this.request  = request;
        this.response = response;
        //check validation
        if (_.isFunction(this.validation)) {
            let validator = await this.validation("update");
            if (!_.isEmpty(validator) && validator.fails()) {
                let errorMessages = await this.webValidateRequestParams(validator)
                session.withErrors({errors: errorMessages }).flashAll()
                response.redirect('back')
                return;
            }
        }
        //load controller before hook
        if (_.isFunction(this.beforeUpdateLoadModel)) {
            let hookResponse = await this.beforeUpdateLoadModel();
            if(  this.__is_error ){
                return hookResponse;
            }
        }
        //create record
        let record = await this.modal.updateRecord(request,request.only(this.modal.getFields()), request.input('slug'));
        //load controller after hook
        if (_.isFunction(this.afterUpdateLoadModel)) {
            var afterHookResponse = await this.afterUpdateLoadModel(record);
            if ( typeof afterHookResponse != 'undefined' ) {
              record = afterHookResponse;
            }
        }
        session.flash({success: Antl.formatMessage(`messages.${this.__success_update_message}`) });
        response.route( this.routeName + '.index');
        return;
    }

    async destroy({request, response, params})
    {
        this.request  = request;
        this.response = response;
        this.params   = params;

        let body = request.all();
        //load controller before hook
        if (_.isFunction(this.beforeDeleteLoadModel)) {
            let hookResponse = await this.beforeDeleteLoadModel();
            if(  this.__is_error ){
                return hookResponse;
            }
        }
        await this.modal.deleteRecord(request, request.all(), params.id);
        let message = body.length > 1 ? Antl.formatMessage('messages.success_delete_messages') : Antl.formatMessage('messages.success_delete_message')
        return response.json({ message:message });
    }

    /**
     * Load Model
     * @param name
     * @returns {object} model instance
     */
    loadModal(name) {
        return use("App/Models/" + name);
    }
}
module.exports = CrudController;
