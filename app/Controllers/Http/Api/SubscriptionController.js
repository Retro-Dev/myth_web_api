'use strict'

const { validateAll, rule } = use("Validator");
const RestController = require("../RestController");
const Subscription = use("App/Models/Subscription");
const User = use("App/Models/User");
const dayjs = use('dayjs');
const Antl = use("Antl");
const _ = use("lodash");
const moment = use('moment')

class SubscriptionController extends RestController {
  constructor() {
    super('Subscription'); //this is your model name
    this.resource = "Subscription"; //this is your resource name
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
          gateway_type: 'required',
          gateway_response: 'required',
          subscription_id: 'required',
          // amount: 'required',
        }
        validator = await validateAll(this.request.all(), rules)
        break;
      case "update":
        rules = {
          // name: 'min:2|max:50',
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
    let params = this.request.all()
    let user = this.request.user()

    let date_string = dayjs();
    let expires_date_ms

    params.gateway_response = JSON.parse(params.gateway_response);

    if (params.subscription_id == 'myth_monthly') {
      date_string = date_string.add(30, 'day')
      date_string = date_string.format('YYYY-MM-DD')

      expires_date_ms = new Date(date_string).getTime();
    } else {
      date_string = date_string.add(365, 'day')
      date_string = date_string.format('YYYY-MM-DD')

      expires_date_ms = new Date(date_string).getTime();
    }

    params.gateway_response.expires_date_ms = expires_date_ms

    if (params.gateway_type === 'apple-pay') {
      params.purchase_date = dayjs(Number(params.gateway_response.purchase_date_ms)).format('YYYY-MM-DD');
      params.transaction_id = params.gateway_response.transaction_id;
      params.original_transaction_id = params.gateway_response.original_transaction_id;
    } else {
      params.purchase_date = params.gateway_response.purchaseTime;
      params.transaction_id = params.gateway_response.transactionId;
      params.original_transaction_id = params.gateway_response.purchaseToken;
    }

    // get subscription
    let another_user_subscription = await Subscription.getAnotherSubscription({ transaction_id: params.transaction_id, original_transaction_id: params.original_transaction_id }, user.id)
    params.expiry_date = dayjs(Number(params.gateway_response.expires_date_ms)).format('YYYY-MM-DD')

    params.gateway_response = JSON.stringify(params.gateway_response);

    // check is another user subscribed
    if (another_user_subscription) {
      this.__is_error = true;
      return this.sendError(
        Antl.formatMessage('messages.unsuccess_subscription_message'),
        { message: Antl.formatMessage('messages.another_transaction_already_exist') },
        400
      );
    }

    // get subscription
    let user_subscription = await Subscription.getSubscription({ user_id: user.id, transaction_id: params.transaction_id, original_transaction_id: params.original_transaction_id })

    // check if current user subscribed
    if (user_subscription) {
      this.__is_error = true;
      return this.sendError(
        Antl.formatMessage('messages.unsuccess_subscription_message'),
        { message: Antl.formatMessage('messages.user_transaction_already_exist') },
        400
      );
    }

    // get subscription user_id, expiry >= current date
    let current_date = dayjs().format('YYYY-MM-DD');
    let subscription = await Subscription.getSubscriptionExpire({ user_id: user.id }, current_date)

    // check if current user already subscribed
    if (subscription) {
      this.__is_error = true;
      return this.sendError(
        Antl.formatMessage('messages.unsuccess_subscription_message'),
        { message: Antl.formatMessage('messages.user_transaction_active') },
        400
      );
    }
    // expire streaming subscription
    // check if subscription expired
    if (user.subscription_expiry_date) {
      if (current_date > user.subscription_expiry_date) {
        await User.updateUser({ slug: user.slug }, { is_subscribed: '0', subscription_expiry_date: null })
        this.__is_error = true;
        return this.sendError(
          Antl.formatMessage('messages.validation_msg'),
          { message: Antl.formatMessage('messages.subscription_expire') },
          400
        );
      }
    }
  }

  /**
   * This function loads before response send to client
   * @param {object} record
   * @param {adonis request object} this.request
   * @param {adonis response object} this.response
   */
  async afterStoreLoadModel(record) {
    let user = this.request.user()

    let data = { is_subscribed: '1', subscription_expiry_date: record.expiry_date }
    // update user
    await User.updateUser({ slug: user.slug }, data)
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
module.exports = SubscriptionController
