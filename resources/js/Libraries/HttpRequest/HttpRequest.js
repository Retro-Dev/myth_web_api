'use strict';

import Helper from "../../Helper";

class HttpRequest
{
    static setHeaders(customHeaders)
    {
        let defaultHeaders = {
          token: window.constants.client_id,
        }
        if( !window._.isEmpty( localStorage.getItem('session') ) ){
            let authUser = Helper.getStorageData('session');
            defaultHeaders['Authorization'] = 'Bearer ' + Helper.encryptCryptoString(authUser.api_token);
        }
        return {
          ...defaultHeaders,
          ...customHeaders
        }
    }

    static async makeRequest(method, url, params, headers = {}, config = {})
    {
        let response;
        if( !window._.isEmpty(headers['Content-Type']) ){
           params = this.setParams(headers['Content-Type'],params);
        }
        try{
          let request_data = {
              method: method,
              url: url,
              headers: this.setHeaders(headers),
              data: params
          };
          if( !window._.isEmpty(config) ){
             request_data = { ...request_data, ...config }
          }
          response = await window.axios(request_data);
        } catch (err){
            if( err.response.status == 401 ){
              Helper.removeStorageData();
              Helper.sweetAlert('error','Error','Your session has been expired. Please login to continue');
              window.location.href = window.constants.admin_login_url;
            } else {
              let error_response = { code:400, message: err }
              if( err.response ){
                error_response.data = err.response.data.data
              }
              return error_response;
            }
        }
        let success_response = { code:200, data: response.data }
        return { code:200, data: response.data };
    }

    static setParams(contentType,params)
    {
        let updateParams;
        switch(contentType){
            case 'application/x-www-form-urlencoded':
                updateParams = new URLSearchParams();
                for (const [key, value] of Object.entries(params)) {
                  updateParams.append(key,value);
                }
              break;
            default:
              updateParams = params;
        }
        return updateParams;
    }
}
export default HttpRequest
