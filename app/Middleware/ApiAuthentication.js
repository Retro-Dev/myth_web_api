'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const _ = use('lodash');
const Encryption = use('Encryption')
const User    = use('App/Models/User');
const Request = use('Adonis/Src/Request')
const Env     = use('Env');
const Antl    = use("Antl");
const CryptoJS  = use("crypto-js");
const jwt       = use('jsonwebtoken');

class ApiAuthentication {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request,response }, next) {
    //check authorization header
    let headers = request.headers();
    let authorization = headers.authorization;
    let jwt_data;

    if( _.isEmpty(authorization) ){
        let res = {
            code: 401,
            message: Antl.formatMessage('messages.authorized_header_required'),
            data:{}
        }
        response.status(401).send(res);
        return;
    }
    authorization = authorization.replace('Bearer ','');
    //decrypt AES Data
    try{
      var key         = CryptoJS.enc.Utf8.parse(Env.get('AES_SECRET'));
      var iv          = CryptoJS.enc.Utf8.parse(Env.get('AES_IV'));
      var bytes       = CryptoJS.AES.decrypt(authorization,key, {iv:iv} );
      var base64Token = bytes.toString(CryptoJS.enc.Utf8);
    } catch (err){
        let res = {
            code: 401,
            message: Antl.formatMessage('messages.invalid_authorized_header'),
            data:{
                message: Antl.formatMessage('messages.invalid_authorized_header')
            }
        }
        response.status(401).send(res);
        return;
    }
    //decode base64 token
    authorization   = Buffer.from(base64Token, 'base64').toString('ascii')
    //get user by authorization header
    let user = await User.getUserByApiToken(authorization);
    if( _.isEmpty(user) ){
        let res = {
            code: 401,
            message: Antl.formatMessage('messages.invalid_authorized_header'),
            data:{
                message: Antl.formatMessage('messages.invalid_authorized_header')

            }
        }
        response.status(401).send(res);
        return;
    }
    //verify jwt
    try{
      jwt_data = await jwt.verify(authorization, Env.get('JWT_SECRET'))
    } catch(err){
        let res = {
            code: 401,
            message: Antl.formatMessage('messages.invalid_authorized_header'),
            data:{
                message: Antl.formatMessage('messages.invalid_authorized_header')

            }
        }
        response.status(401).send(res);
        return;
    }
    //check email is verified
    if( !user.is_email_verify && Env.get('EMAIL_VERIFICATION') == 1 ){
        let res = {
            code: 401,
            message: Antl.formatMessage('messages.unverified_email'),
            data:{
                message: Antl.formatMessage('messages.unverified_email'),
            }
        }
        response.status(401).send(res);
        return;
    }
    //check mobile no is verified
    let except_routes = ['/api/user/verify/code','/api/user/resend/code']
    if( !except_routes.includes(request.url()) ){
        if( !user.is_mobile_verify && Env.get('OTP_VERIFICATION') == 1 ){
          let res = {
              code: 401,
              message: Antl.formatMessage('messages.unverified_mobile'),
              data:{
                message: Antl.formatMessage('messages.unverified_mobile'),
              }
          }
          response.status(401).send(res);
          return;
      }
    }

    //check account status is enable
    if( user.status == 0 ){
        let res = {
            code: 401,
            message: Antl.formatMessage('messages.account_disabled'),
            data:{
                message: Antl.formatMessage('messages.account_disabled'),
            }
        }
        response.status(401).send(res);
        return;
    }
    Request.macro( 'user', function(){
        return user
    });
    Request.macro('authorization',function(){
      return authorization;
    })
    await next()
  }

}

module.exports = ApiAuthentication
