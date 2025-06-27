'use strict'

const _ = use('lodash');

class Category
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
      return {
        id: record.id,
        name: record.name,
        status: record.status,
        slug: record.slug,
        created_at: record.created_at,
      }
  }

}
module.exports = Category;
