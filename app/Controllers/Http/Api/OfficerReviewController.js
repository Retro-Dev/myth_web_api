'use strict'

const { validateAll, rule } = use("Validator");
const RestController = require("../RestController");
const Directory = use("App/Models/Directory");
const Review = use("App/Models/Review");
const { sendPushNotification } = use("App/Helpers/Index.js");
const User = use('App/Models/User');

class OfficerReviewController extends RestController {
  constructor() {
    super('OfficerReview'); //this is your model name
    this.resource = "OfficerReview"; //this is your resource name
    this.request; //adonis request obj
    this.response; //adonis response obj
    this.params = {}; // this is used for get parameters from url

    this.__success_store_message = 'police_review_created_successfully'
    this.__success_update_message = 'police_review_updated_successfully'
    this.__success_delete_message = 'police_review_deleted_successfully'
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
          officer_id: 'required',
          rate: 'required',
          review: 'required',
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


    // let directory = await Directory.getDirectory({ id: record.officer_id })

    // // send push
    // // get target
    // let target = await User.query()
    //   .select('users.*', 'uat.device_type', 'uat.device_token')
    //   .innerJoin('user_api_tokens AS uat', 'uat.user_id', 'users.id')
    //   .where('users.id', directory.user_id)
    //   .fetch();

    // target = target.toJSON();

    // let module = 'ratings'
    // let title = 'Rating'
    // // let message = `${user.name} has been updated rate and review.`
    // let message = `User has been updated rate and review.`
    // let identifier = 'rating'

    // await sendPushNotification(module, title, message, directory, identifier, user, target, undefined,true, target[0].is_notification)
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
module.exports = OfficerReviewController
