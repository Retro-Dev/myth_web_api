'use strict'

const _ = use('lodash');
const {baseUrl} = use("App/Helpers/Index.js");
const UserShort = use('App/Controllers/Http/Resource/UserShort.js')
const Post = use('App/Controllers/Http/Resource/Post.js')
const util = use('util')

class Like
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
      return await Post.initResponse(record.post, request)
      // {
      //   id: record.id,
      //   is_like: record.is_like,
      //   slug: record.slug,
      //   // created_at: record.created_at,
      //   // updated_at: record.updated_at,
      //   user: await UserShort.initResponse(record.user, request),
      //   post: await Post.initResponse(record.post, request),
      // }
  }

}
module.exports = Like;
