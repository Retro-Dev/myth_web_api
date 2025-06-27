'use strict';

const Env    = use('Env');
const axios = use('axios');
const Antl = use("Antl");
const HttpClient = use('App/Libraries/HttpRequest/Index.js')

class Twilio
{
    constructor()
    {
        this.account_id = Env.get('TWILIO_ACCOUNT_SID');
        this.auth_token = Env.get('TWILIO_AUTH_TOKEN');
        this.service_id = Env.get('TWILIO_SERVICE_ID');
    }

    async sendOTP(mobile_no)
    {
        mobile_no = mobile_no.replace('-','');
        mobile_no = mobile_no.replace('+','');
        let apiResponse;

        let method = 'post';
        let url    = `https://verify.twilio.com/v2/Services/${this.service_id}/Verifications`;
        let param  = {
            To: '+'+mobile_no,
            Channel: 'sms'
        }
        let headers = {
          'Content-Type':'application/x-www-form-urlencoded'
        }
        let config = {
            auth: {
              username: this.account_id,
              password: this.auth_token
            }
        }
        apiResponse = await HttpClient.makeRequest(method,url,param,headers,config);
        if( apiResponse.code != 200 ){
            return {
                code: 400,
                message: apiResponse.data.response.data.message,
                data: apiResponse.data.response.data
            }
        } else {
            return {
                code: 200,
                message:'OTP has been sent successfully',
                data:apiResponse.data.data
            }
        }
    }

    async verifyOTP(user,code)
    {
        let mobile_no = user.mobile_no;
            mobile_no = mobile_no.replace('-','');
            mobile_no = mobile_no.replace('+','');

        let method = 'post';
        let url    = `https://verify.twilio.com/v2/Services/${this.service_id}/VerificationCheck`;
        let param  = {
            To: '+'+mobile_no,
            Code: code
        }
        let headers = {
          'Content-Type':'application/x-www-form-urlencoded'
        }
        let config = {
            auth: {
              username: this.account_id,
              password: this.auth_token
            }
        }
        let apiResponse = await HttpClient.makeRequest(method,url,param,headers,config);
        let response_status = apiResponse.data.status;
        if( typeof response_status == 'undefined' ){
            return {
                code: 400,
                message: Antl.formatMessage('messages.expired_2fa_code'),
                data:apiResponse.data
            }
        } else if( apiResponse.data.status != 'approved'){
            return {
                code: 400,
                message: Antl.formatMessage('messages.invalid_2fa_code'),
                data:apiResponse.data
            }
        } else {
            return {
                code: 200,
                message: Antl.formatMessage('messages.verified_2fa_account'),
                data: apiResponse.data
            }
        }
    }
}
module.exports = Twilio;
