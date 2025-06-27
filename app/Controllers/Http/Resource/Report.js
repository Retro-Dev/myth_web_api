'use strict'

const _ = use('lodash');
const {baseUrl} = use("App/Helpers/Index.js");
const PostShort = use('App/Controllers/Http/Resource/PostShort.js')

class Report
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
        description: record.description,
        slug: record.slug,
        created_at: record.created_at,
        updated_at: record.updated_at,
        post: await PostShort.initResponse(record.post, request),
      }
  }

}
module.exports = Report;
