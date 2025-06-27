'use strict'

const _ = use('lodash');
const UserShort = use('App/Controllers/Http/Resource/Socket/UserShort.js')

class Contact
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
        user: await UserShort.initResponse(record.user, request),
        user_2 : await UserShort.initResponse(record.user_2, request),
        slug: record.slug,
        created_at: record.created_at,
      }
  }

}
module.exports = Contact;
