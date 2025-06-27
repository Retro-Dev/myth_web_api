'use strict'

const { validateAll, rule } = use("Validator");
const RestController = require("../RestController");
const { sendPushNotification } = use("App/Helpers/Index.js");
const User = use("App/Models/User");

class CommentController extends RestController {
  constructor() {
    super('Comment'); //this is your model name
    this.resource = "Comment"; //this is your resource name
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
    let messages
    switch (action) {
      case "store":
        rules = {
          comment: [
            rule('required'),
            rule('regex', /^(?!\s).*/),
          ],
        }

        messages = {
          'comment.regex': 'Comment is empty.',
        }
        validator = await validateAll(this.request.all(), rules, messages)
        break;
      case "update":
        rules = {
          comment: [
            rule('required'),
            rule('regex', /^(?!\s).*/),
          ],
        }
        messages = {
          'comment.regex': 'Comment is empty.',
        }

        validator = await validateAll(this.request.all(), rules, messages)
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
    this.resource = 'CommentShort'
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
        // send push 
        let actor = this.request.user()
        let target = await User.getUserWToken({slug: record.post.user.slug})
        
        let reference_id =  record.post.id
        let reference_module =  'post_comment'
        let reference_slug =  record.post.slug
        let identifier = 'post_comment'
        let title = 'Myth'
        let message = actor.is_pseudo_name == '0' ? `${actor.name} commented on your post`: `${actor.pseudo_name} commented on your post`
        let module = "posts"
        let data = {}
        let in_app = true
        let is_push = target.is_notification
        
        if(actor.id != record.post.user.id) {
          await sendPushNotification(module, title, message ,record, reference_id,reference_module,reference_slug,identifier,actor, target, data, in_app,is_push)

        }
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
module.exports = CommentController
