'use strict'

const { validateAll, rule } = use("Validator");
const RestController = require("../RestController");
const Directory = use("App/Models/Directory");
const Review = use("App/Models/Review");
const { sendPushNotification } = use("App/Helpers/Index.js");
const User = use('App/Models/User');

class ReviewController extends RestController {
  constructor() {
    super('Review'); //this is your model name
    this.resource = "Review"; //this is your resource name
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
          directory_id: 'required',
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


    // let directory = await Directory.getDirectory({ id: record.directory_id })

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
    let params = this.request.all()
    // calculate avg
    let rate_avg = await Review.calculateAvg({ directory_id: params.directory_id })

    // calculate total
    let total_reviews = await Review.getCount({ directory_id: params.directory_id })

    // update directory
    await Directory.updateDirectory({ id: params.directory_id }, { rating_avg: rate_avg, total_reviews: total_reviews })
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
    // get review
    let review = await Review.getReview({ slug: this.params.id })

    // // calculate avg
    let rate_avg = await Review.calculateAvg({ directory_id: review.directory_id })

    // // update directory
    await Directory.updateDirectory({ id: review.directory_id }, { rating_avg: rate_avg })
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
    // get review
    let review = await Review.getReview({ slug: this.params.id })

    // // calculate avg
    let rate_avg = await Review.calculateAvg({ directory_id: review.directory_id })

    // // calculate total
    let total_reviews = await Review.getCount({ directory_id: review.directory_id })

    // // update directory
    await Directory.updateDirectory({ id: review.directory_id }, { rating_avg: rate_avg, total_reviews: total_reviews })
  }

}
module.exports = ReviewController
