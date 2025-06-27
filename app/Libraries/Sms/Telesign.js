'use strict';

const Env         = use('Env');
const TeleSignSDK = use('telesignsdk');
const Request     = use('Adonis/Src/Request')
const { rand }    = use('App/Helpers/Index.js');
const timeout     = 10*1000; // 10 secs
const Antl        = use("Antl");

class Telesign
{
    constructor()
    {
        this._telesign = new TeleSignSDK(
            Env.get('CUSTOMER_ID'), Env.get('API_KEY'), Env.get('REST_ENDPOINT'), timeout
          );
    }

    sendOTP(mobile_no)
    {
        mobile_no = mobile_no.replace('+','');
        mobile_no = mobile_no.replace('-','');
        let verification_code = rand(1111,9999);
        return new Promise( (resolve,reject) => {
            let message = "Your verification code is " + verification_code;
            let messageType = "ARN";
            let teleSignRes;
            this._telesign.sms.message(function(error, responseBody){
                if( responseBody.status.code != 290 ){
                    teleSignRes = {
                        code: 400,
                        message: responseBody.status.description,
                        data: responseBody
                    }
                } else {
                    Request.macro('mobileOtp', function () {
                      return verification_code;
                    })
                    teleSignRes = {
                        code: 200,
                        message: responseBody.status.description,
                        data: responseBody
                    }
                }
                resolve(teleSignRes)
              },
              mobile_no,
              message,
              messageType
            );
        })
    }

    async verifyOTP(user, code)
    {
        let response;
        let mobile_otp = user.mobile_otp
        mobile_otp = mobile_otp.split('|');
        if( mobile_otp[0] != code ){
            response = {
                code:400,
                message: Antl.formatMessage('messages.invalid_2fa_code')
            }
        } else {
            response = {
              code:200,
              message: Antl.formatMessage('messages.verified_2fa_code')
            }
        }
        return response;
    }
}
module.exports = Telesign
