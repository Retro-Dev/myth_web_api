'use strict'

const _ = use('lodash');
const UserShort = use('App/Controllers/Http/Resource/UserShort.js')
const PanicShort = use('App/Controllers/Http/Resource/PanicShort.js')

class Witness
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
      return {
        id: record.id,
        user: await UserShort.initResponse(record.user, request),
        panic: await PanicShort.initResponse(record.panic, request),
        created_at: record.created_at,
        updated_at: record.updated_at,
      }
  }

}
module.exports = Witness;
