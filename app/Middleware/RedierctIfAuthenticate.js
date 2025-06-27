'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const _ = use('lodash');

class RedierctIfAuthenticate {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, auth, response }, next)
  {
      let user = auth.user;
      if( !_.isEmpty(user) ){
          response.route('admin.dashboard');
      }
      // call next to advance the request
      await next()
  }
}

module.exports = RedierctIfAuthenticate
