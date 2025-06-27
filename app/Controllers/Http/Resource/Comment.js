'use strict'

const _ = use('lodash');
const {baseUrl} = use("App/Helpers/Index.js");
const UserShort = use('App/Controllers/Http/Resource/UserShort.js')
const Post = use('App/Controllers/Http/Resource/Post.js')

class Comment
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
        response = await this.jsonSchema(data,request)
      }
      return response;
  }

  static async jsonSchema(record,request)
  {
    let newInputDate = record.created_at.replace(" ", "T");
    let timestamp = new Date(newInputDate).getTime();
      return {
        id: record.id,
        comment: record.comment,
        slug: record.slug,
        timestamp: timestamp,
        created_at: record.created_at,
        updated_at: record.updated_at,
        user: await UserShort.initResponse(record.user, request),
        post: await Post.initResponse(record.post, request),
      }
  }

}
module.exports = Comment;
