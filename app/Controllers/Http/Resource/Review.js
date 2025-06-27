'use strict'

const _ = use('lodash');
const {baseUrl} = use("App/Helpers/Index.js");
const PublicUser = use('App/Controllers/Http/Resource/PublicUser.js')
const Directory = use('App/Controllers/Http/Resource/Directory.js')
const util = use('util')

class User
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
          response.push(await this.jsonSchema(data[i],request));
        }
      } else {
        response =await this.jsonSchema(data,request)
      }
      return response;
  }

  static async jsonSchema(record,request)
  {
      return {
        id: record.id,
        slug: record.slug,
        rate: record.rate,
        review: record.review,
        created_at: record.created_at,
        timestamp: new Date(record.created_at.replace(' ', 'T')).getTime(),
        user: await PublicUser.initResponse(record.user, request),
        directory: await Directory.initResponse(record.directory, request),
      }
  }

}
module.exports = User;
