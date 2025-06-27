'use strict'

const { validateAll, rule } = use("Validator");
const RestController = require("../RestController");
const Like = use("App/Models/Like");
const Post = use("App/Models/Post");
const User = use("App/Models/User");
const Antl = use("Antl");
const { sendPushNotification } = use("App/Helpers/Index.js");
const _ = use("lodash");

class LikeController extends RestController {
  constructor() {
    super('Like'); //this is your model name
    this.resource = "Like"; //this is your resource name
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
          is_like: 'required|in:0,1',
          post_id: 'required'
        }
        validator = await validateAll(this.request.all(), rules)
        break;
      case "update":
        rules = {
          is_like: 'required|in:0,1',
          post_id: 'required'
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
    this.resource = "LikeShort";
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

  async likePost({ request, response }) {
    this.request = request
    this.response = response

    let params = request.all()
    let user = request.user()

    let like_record = await Like.getLikeRecord({ post_id: params.post_id, user_id: user.id })

    // if recrd does not exist create record
    if (_.isEmpty(like_record)) {
      let data = {
        is_like: params.is_like,
        post_id: params.post_id,
        slug: 'like_' + Math.floor((Math.random() * 100) + 1) + new Date().getTime(),
        user_id: user.id,
        created_at: new Date()
      }
      like_record = await Like.createLikeRecord(data)
    }

    // if recrd exists update is_like
    else {
      let condition = {
        post_id: params.post_id,
        user_id: user.id
      }
      let data = {
        is_like: params.is_like,
      }

      like_record = await Like.updateLikeRecord(condition, data)
    }

    // get like counts
    let count = await Like.getLikeCount({ post_id: params.post_id, is_like: 1 })

    // updating total like count of post record
    await Post.updateTotalLikes({ id: params.post_id }, {total_like: count})

    // get like record
    like_record = await Like.getLikeUserPostRecord({ post_id: params.post_id, user_id: user.id })


    // send push 
    let actor = request.user()
    let target = await User.getUserWToken({slug: like_record.post.user.slug})
    let reference_id =  like_record.post.id
    let reference_module =  'post_like'
    let reference_slug =  like_record.post.slug
    let identifier = 'post_like'
    let title = 'Myth'
    let message = actor.is_pseudo_name == '0' ? `${actor.name} has liked your post`: '' + user.pseudo_name + ' has liked your post'
    let module = "posts"
    let record = like_record
    let data = {}
    let in_app = true
    let is_push = target.is_notification
    
    if(params.is_like == '1' && actor.id != like_record.post.user.id) {
      await sendPushNotification(module, title, message ,record, reference_id,reference_module,reference_slug,identifier,actor, target, data, in_app,is_push)
    }

    this.__is_paginate = false;
    this.sendResponse(
      200,
      Antl.formatMessage('messages.success_listing_message'),
      like_record
    );
  }
}
module.exports = LikeController
