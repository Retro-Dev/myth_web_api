'use strict'

const _ = use('lodash');

class Faq
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
        id: record._id,
        slug: record.slug,
        question: record.question,
        answer: record.answer,
        created_at: record.created_at
      }
  }

}
module.exports = Faq;
