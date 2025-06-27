
'use strict'

const _ = use('lodash');
const {baseUrl} = use("App/Helpers/Index.js");

class ApplicationSetting
{
  static async initResponse(data,request)
  {
      if( _.isEmpty(data) )
        return [];

      let response;
      if( Array.isArray(data) ){
        response = []
        for(var i=0; i < data.length; i++)
        {
          response.push( this.jsonSchema(data[i],request));
        }
      } else {
        response = this.jsonSchema(data,request)
      }
      return response;
  }

  static jsonSchema(record,request)
  {
      if( _.isEmpty(record.logo) )
        record.logo = 'images/logo.png';

      if( _.isEmpty(record.favicon) )
        record.favicon = 'images/favicon.png';

      return record;
  }

}
module.exports = ApplicationSetting;
