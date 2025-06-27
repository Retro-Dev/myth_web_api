'use strict';

const axios = use('axios');
const _ = use('lodash');

class Index
{
    constructor()
    {
      this.headers = {}
    }

    static setHeaders(customHeaders)
    {
        let defaultHeaders = this.headers;
        return {
          ...defaultHeaders,
          ...customHeaders
        }
    }

    static async makeRequest(method, url, params, headers = {}, config = {})
    {
        let response;
        if( !_.isEmpty(headers['Content-Type']) ){
           params = this.setParams(headers['Content-Type'],params);
        }
        try{
          let request_data = {
              method: method,
              url: url,
              headers: this.setHeaders(headers),
              data: params
          };
          if( !_.isEmpty(config) ){
             request_data = { ...request_data, ...config }
          }
          response = await axios(request_data);
        } catch (err){
            return { code:400, data: err }
        }
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
module.exports = Index
