'use strict'

const _    = use('lodash');
const Env  = use('Env');
const User = use('App/Models/User');
const CryptoJS  = use("crypto-js");

class SocketAuthenticate
{
    static async handle(token)
    {
        try{
          var key         = CryptoJS.enc.Utf8.parse(Env.get('AES_SECRET'));
          var iv          = CryptoJS.enc.Utf8.parse(Env.get('AES_IV'));
          var bytes       = CryptoJS.AES.decrypt(token,key, {iv:iv} );
          var base64Token = bytes.toString(CryptoJS.enc.Utf8);
        } catch (err){
            return false;
        }
        //decode base64 token
        let authorization   = Buffer.from(base64Token, 'base64').toString('ascii')
        //get user by authorization header
        let user = await User.getUserByApiToken(authorization);
        if( _.isEmpty(user) ){
          return false;
        }
        return user;
    }

}
module.exports = SocketAuthenticate
