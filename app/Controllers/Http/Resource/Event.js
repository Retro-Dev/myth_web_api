'use strict'

const _ = use('lodash');
const {baseUrl} = use("App/Helpers/Index.js");

class Event
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
        title: record.title,
        description: record.description,
        file_url: record.file_url,
        file_type: record.file_type,
        thumbnail_url: record.thumbnail_url,
        address: record.address,
        status: record.status,
        type: record.type,
        date: record.date,
        time: record.time,
        slug: record.slug,
        created_at: record.created_at,
        timestamp: new Date(record.created_at.replace(' ', 'T')).getTime()
      }
  }

}
module.exports = Event;
