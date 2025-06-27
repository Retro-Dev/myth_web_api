"use strict";
const Controller = use("./Controller.js");
const _ = use("lodash");
const Antl = use("Antl");
// const { base_url } = use("App/Helpers/Index.js");

class RestController extends Controller {

    constructor(modal) {
        super();
        this.modal     = this.loadModal(modal);
        this.__success_listing_message = 'success_listing_message';
        this.__success_store_message   = 'success_store_message';
        this.__success_show_message    = 'success_show_message';
        this.__success_update_message  = 'success_update_message';
        this.__success_delete_message  = 'success_delete_message';
    }

    /**
     * Show a list of all users.
     * GET users
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response }) {

        this.request = request;
        this.response = response;

        if (_.isFunction(this.validation)) {
            let validator = await this.validation("index");
            if (!_.isEmpty(validator) && validator.fails()) {
                this.sendError(
                  Antl.formatMessage('messages.validation_msg'),
                  validator.messages(),
                  400
                )
                return;
            }
        }
        // load before index hook if exist
        if (_.isFunction(this.beforeIndexLoadModel)) {
            var hookResponse = await this.beforeIndexLoadModel();
            if (this.__is_error) {
                return hookResponse;
            }
        }
        //get records from model
        let params  = request.all();
        let records = await this.modal.getRecords(request, request.all());
        // load after index hook if exis
        if (_.isFunction(this.afterIndexLoadModel)) {
            var afterHookResponse = await this.afterIndexLoadModel(records);
            if ( typeof afterHookResponse != 'undefined' ) {
              records = afterHookResponse;
            }
        }
        await this.sendResponse(
                200,
                Antl.formatMessage('messages.' + this.__success_listing_message),
                records
              );
        return;
    }

    /**
     * Create/save a new user.
     * POST users
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response })
    {
        this.request = request;
        this.response = response;
        //validation
        if (_.isFunction(this.validation)) {
            let validator = await this.validation("store");
            if (!_.isEmpty(validator) && validator.fails()) {
                this.sendError(
                    'Validation Message',
                    this.setValidatorMessagesResponse(validator.messages()),
                    400
                )
                return;
            }
        }
        // before store hook
        if (_.isFunction(this.beforeStoreLoadModel)) {
            var hookResponse = await this.beforeStoreLoadModel();
            if (this.__is_error) {
                return hookResponse;
            }
        }
        let record = await this.modal.createRecord(request,request.only(this.modal.getFields()));

        // after store hook
        if (_.isFunction(this.afterStoreLoadModel)) {
            var afterHookResponse = await this.afterStoreLoadModel(record);
            if ( typeof afterHookResponse != 'undefined' ) {
              record = afterHookResponse;
            }
        }
        this.__is_paginate = false;
        await this.sendResponse(
          200,
          Antl.formatMessage('messages.' + this.__success_store_message),
          record
        );
        return;
    }

    /**
     * Display a single user.
     * GET users/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response })
    {
        this.request = request;
        this.response = response;
        this.params = params;
        // before show hook
        if (_.isFunction(this.beforeShowLoadModel)) {
            var hookResponse =await this.beforeShowLoadModel();
            if (this.__is_error) {
                return hookResponse;
            }
        }
        let record = await this.modal.getRecordBySlug(request, params.id);
        // after show hook
        if (_.isFunction(this.afterShowLoadModel)) {
            var afterHookResponse = await this.afterShowLoadModel(record);
            if ( typeof afterHookResponse != 'undefined' ) {
                record = afterHookResponse;
            }
        }
        this.__is_paginate = false;
        await this.sendResponse(
          200,
          Antl.formatMessage('messages.' + this.__success_show_message),
          record
        );
        return;
    }

    /**
     * Update user details.
     * PUT or PATCH users/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response })
    {
        this.request  = request;
        this.response = response;
        this.params   = params;
        //validation
        if (_.isFunction(this.validation)) {
            let validator = await this.validation("update",params.id);
            if (!_.isEmpty(validator) && validator.fails()) {
                this.sendError(
                    'Validation Message',
                    this.setValidatorMessagesResponse(validator.messages()),
                    400
                )
                return;
            }
        }
        //before update hook
        if (_.isFunction(this.beforeUpdateLoadModel)) {
            var hookResponse = await this.beforeUpdateLoadModel();
            if (this.__is_error) {
                return hookResponse;
            }
        }
        let record = await this.modal.updateRecord(
            request,
            request.only(this.modal.getFields()),
            params.id
        );
        //before update hook
        if (_.isFunction(this.afterUpdateLoadModel)) {
            var afterHookResponse = await this.afterUpdateLoadModel(record);
            if ( typeof afterHookResponse != 'undefined' ) {
               record = afterHookResponse;
            }
        }
        this.__is_paginate = false;
        await this.sendResponse(
          200,
          Antl.formatMessage('messages.' + this.__success_update_message),
          record
        );
        return;
    }

    /**
     * Delete a user with id.
     * DELETE users/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response })
    {
        let record    = [];
        this.request  = request;
        this.response = response;
        this.params   = params;
        //before destroy hook
        if (_.isFunction(this.beforeDestoryLoadModel)) {
            var hookResponse = await this.beforeDestoryLoadModel();
            if (this.__is_error) {
                return hookResponse;
            }
        }
        await this.modal.deleteRecord(request, request.all(), params.id);
         //after destroy hook
        if (_.isFunction(this.afterDestoryLoadModel)) {
            var afterHookResponse = await this.afterDestoryLoadModel();
            if ( typeof afterHookResponse != 'undefined' ) {
                record = afterHookResponse;
            }
        }
        this.__is_paginate = false;
        await this.sendResponse(
          200,
          Antl.formatMessage('messages.' + this.__success_delete_message),
          record
        );
        return;
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
module.exports = RestController;
