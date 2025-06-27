'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const _ = use('lodash');
const Antl = use('Antl');
const Request = use('Adonis/Src/Request')

class AdminAuthenticate {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ session, auth, response }, next) {

    if( _.isEmpty(auth.user) ){
      response.route('admin.login');
      return;
    }
    Request.macro( 'user', function(){
        return auth.user
    });
    // call next to advance the request
    await next()
  }
}

module.exports = AdminAuthenticate
