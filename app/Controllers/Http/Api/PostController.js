'use strict'

const { validateAll, rule } = use("Validator");
const RestController = require("../RestController");
const Report = use("App/Models/Report");
const Antl = use("Antl");

class PostController extends RestController
{
    constructor()
    {
        super('Post'); //this is your model name
        this.resource = "Post"; //this is your resource name
        this.request; //adonis request obj
        this.response; //adonis response obj
        this.params = {}; // this is used for get parameters from url
    }

    /**
     * This function is used for validate restfull request
     * @param $action
     * @param string $slug
     * @return validator response
     */
    async validation(action, slug = '')
    {
        let validator = [];
        let rules;
        switch (action) {
            case "store":
              rules = {
                description: 'required|min:2|max:800',
                media_id: 'required'
              }
              validator = await validateAll(this.request.all(), rules)
              break;
            case "update":
                rules = {
                  description: 'required|min:2|max:800',
                }
                validator = await validateAll(this.request.all(), rules);
                break;
        }
        return validator;
    }

    /**
     * This function loads before a model load
     * @param {adonis request object} this.request
     * @param {adonis response object} this.response
     */
    async beforeIndexLoadModel()
    {

    }

    /**
     * This function loads before response send to client
     * @param {adonis request object} this.request
     * @param {adonis response object} this.response
     */
    async afterIndexLoadModel()
    {

    }

    /**
     * This function loads before a model load
     * @param {adonis request object} this.request
     * @param {adonis response object} this.response
     */
    async beforeStoreLoadModel()
    {

    }

    /**
     * This function loads before response send to client
     * @param {object} record
     * @param {adonis request object} this.request
     * @param {adonis response object} this.response
     */
    async afterStoreLoadModel(record)
    {

    }

   /**
     * This function loads before a model load
     * @param {adonis request object} this.request
     * @param {adonis response object} this.response
     * @param {adonis param object} this.params
     */
    async beforeShowLoadModel()
    {

    }

    /**
     * This function loads before response send to client
     * @param {object} record
     * @param {adonis request object} this.request
     * @param {adonis response object} this.response
     * @param {adonis param object} this.params
     */
    async afterShowLoadModel(record)
    {

    }

    /**
     * This function loads before a model load
     * @param {adonis request object} this.request
     * @param {adonis response object} this.response
     * @param {adonis param object} this.params
     */
    async beforeUpdateLoadModel()
    {

    }

   /**
     * This function loads before response send to client
     * @param {object} record
     * @param {adonis request object} this.request
     * @param {adonis response object} this.response
     * @param {adonis param object} this.params
     */
    async afterUpdateLoadModel(record)
    {

    }

    /**
     * This function loads before a model load
     * @param {adonis request object} this.request
     * @param {adonis response object} this.response
     * @param {adonis param object} this.params
     */
    async beforeDestoryLoadModel()
    {

    }

    /**
     * This function loads before response send to client
     * @param {object} record
     * @param {adonis request object} this.request
     * @param {adonis response object} this.response
     * @param {adonis param object} this.params
     */
    async afterDestoryLoadModel()
    {

    }

    async postReport({ request, response }) {
      this.request = request
      this.response = response
  
      let params = request.all()
      let user = request.user()
  
      let rules = {
        "post_id": 'required',
        "description": 'required',
      }
      
      let validator = await validateAll(request.all(), rules);
      let validation_error = this.validateRequestParams(validator);
      if (this.__is_error)
        return validation_error;
  
      // create report record
      let data = {
        post_id: params.post_id,
        user_id: user.id,
        description: params.description,
        slug: 'rprt_' + Math.floor((Math.random() * 100) + 1) + new Date().getTime(),
        user_id: user.id,
        created_at: new Date()
      }
  
      let record = await Report.createReportRecord(data)
  
      let condition = {
        post_id: params.post_id,
        user_id: user.id,
      }
      // get report record
      record = await Report.getReport(condition)
  
      this.resource = 'Report'
  
      this.__is_paginate = false;
      this.sendResponse(
        200,
        Antl.formatMessage('messages.success_listing_message'),
        record
      );
    }

}
module.exports = PostController
