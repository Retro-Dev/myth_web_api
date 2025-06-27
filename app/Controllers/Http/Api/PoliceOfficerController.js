'use strict'

const { validateAll, rule } = use("Validator");
const RestController = require("../RestController");
const Directory = use("App/Models/Directory");
const Antl = use("Antl");
const _ = use("lodash");
const PoliceOfficer = use("App/Models/PoliceOfficer");

class PoliceOfficerController extends RestController
{
    constructor()
    {
        super('PoliceOfficer'); //this is your model name
        this.resource = "PoliceOfficer"; //this is your resource name
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
                name: 'required',
                badge_no: 'required',
                city: 'required',
                state: 'required',
              }
              validator = await validateAll(this.request.all(), rules)
              break;
            case "update":
                rules = {
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
      // validate image_url
      if (!this.request.file('image_url')) {
        this.__is_error = true;
        this.sendError(
            Antl.formatMessage('messages.validation_msg'),
            { message: "Please upload profile image." },
            400
        );
        return
      }
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
      let officer = await PoliceOfficer.getOfficer({slug: this.params.id, status: '1'});
      if(_.isEmpty(officer)) {
        this.__is_error = true;
        this.sendError(
            Antl.formatMessage('messages.validation_msg'),
            { message: Antl.formatMessage('messages.directory_disabled') },
            400
        );
        return
      } 
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

}
module.exports = PoliceOfficerController
