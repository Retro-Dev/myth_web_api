'use strict'

const _ = use('lodash');
const {baseUrl} = use("App/Helpers/Index.js");
const UserShort = use('App/Controllers/Http/Resource/UserShort.js')
const PostShort = use('App/Controllers/Http/Resource/PostShort.js')

class LikeShort
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
          response.push( await this.jsonSchema(data[i],request));
        }
      } else {
        response = await this.jsonSchema(data,request)
      }
      return response;
  }

  static async jsonSchema(record,request)
  {
      return await UserShort.initResponse(record.user, request)      
  }

}
module.exports = LikeShort;
