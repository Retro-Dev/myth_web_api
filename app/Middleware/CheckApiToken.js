'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const _    = use('lodash');
const Antl = use("Antl");
const Env  = use('Env');
const CryptoJS  = use("crypto-js");

class CheckApiToken {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request,response }, next) {
    // call next to advance the request
    let token     = request.header('token');
    let client_id = Env.get('CLIENT_ID');

    if( _.isEmpty(token) ){
        let data = {
            code: 401,
            message: Antl.formatMessage('messages.unauthorized'),
            data:{}
        }
        response.status(401).send(data);
        return;
    }
    //decrypt client id
    try{
      var key         = CryptoJS.enc.Utf8.parse(Env.get('AES_SECRET'));
      var iv          = CryptoJS.enc.Utf8.parse(Env.get('AES_IV'));
      var bytes       = CryptoJS.AES.decrypt(token,key, {iv:iv} );
      var decrypt_token = bytes.toString(CryptoJS.enc.Utf8);
    } catch (err){
        let res = {
            code: 401,
            message: Antl.formatMessage('messages.invalid_authorized_header'),
            data:{}
        }
        response.status(401).send(res);
        return;
    }
    //check client id is valid or not
    if( decrypt_token != client_id){
        let res = {
            code: 401,
            message: Antl.formatMessage('messages.invalid_authorized_header'),
            data:{}
        }
        response.status(401).send(res);
        return;
    }

    await next()
  }
}

module.exports = CheckApiToken
