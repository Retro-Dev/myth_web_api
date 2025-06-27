'use strict'

const { validateAll, rule } = use("Validator");
const RestController = require("../RestController");
const { fileValidation } = use('App/Helpers/Index.js');
const Antl = use("Antl");

class MediaController extends RestController {
  constructor() {
    super('Media'); //this is your model name
    this.resource = "Media"; //this is your resource name
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
  async validation(action, slug = '') {
    let validator = [];
    let rules;
    switch (action) {
      case "store":
        rules = {
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
  async beforeIndexLoadModel() {

  }

  /**
   * This function loads before response send to client
   * @param {adonis request object} this.request
   * @param {adonis response object} this.response
   */
  async afterIndexLoadModel() {

  }

  /**
   * This function loads before a model load
   * @param {adonis request object} this.request
   * @param {adonis response object} this.response
   */
  async beforeStoreLoadModel() {
    if (this.request.file('media_url') == null) {
      this.__is_error = true
      return this.sendError(
        Antl.formatMessage('messages.validation_msg'),
        { message: 'File is required' },
        400
      );
    }

    let fileValidate = fileValidation(this.request.file('media_url'),2000000000, ['mp4','mov','quicktime','png', 'jpg', 'jpeg']);
    if ( fileValidate.error ) {
        this.__is_error = true;
        return this.sendError(
            Antl.formatMessage('messages.validation_msg'),
            { message: fileValidate.message },
            400
        );
    }
  }

  /**
   * This function loads before response send to client
   * @param {object} record
   * @param {adonis request object} this.request
   * @param {adonis response object} this.response
   */
  async afterStoreLoadModel(record) {

  }

  /**
    * This function loads before a model load
    * @param {adonis request object} this.request
    * @param {adonis response object} this.response
    * @param {adonis param object} this.params
    */
  async beforeShowLoadModel() {

  }

  /**
   * This function loads before response send to client
   * @param {object} record
   * @param {adonis request object} this.request
   * @param {adonis response object} this.response
   * @param {adonis param object} this.params
   */
  async afterShowLoadModel(record) {

  }

  /**
   * This function loads before a model load
   * @param {adonis request object} this.request
   * @param {adonis response object} this.response
   * @param {adonis param object} this.params
   */
  async beforeUpdateLoadModel() {

  }

  /**
    * This function loads before response send to client
    * @param {object} record
    * @param {adonis request object} this.request
    * @param {adonis response object} this.response
    * @param {adonis param object} this.params
    */
  async afterUpdateLoadModel(record) {

  }

  /**
   * This function loads before a model load
   * @param {adonis request object} this.request
   * @param {adonis response object} this.response
   * @param {adonis param object} this.params
   */
  async beforeDestoryLoadModel() {

  }

  /**
   * This function loads before response send to client
   * @param {object} record
   * @param {adonis request object} this.request
   * @param {adonis response object} this.response
   * @param {adonis param object} this.params
   */
  async afterDestoryLoadModel() {
    
  }
}
module.exports = MediaController