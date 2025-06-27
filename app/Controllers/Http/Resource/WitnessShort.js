'use strict'

const _ = use('lodash');
const UserShort = use('App/Controllers/Http/Resource/UserShort.js')
const MediaShort = use('App/Controllers/Http/Resource/MediaShort.js')
const MediaModel       = use('App/Models/Media');


class WitnessShort
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
        media: await MediaShort.initResponse(await MediaModel.getMedia({user_id: record.user.id, module_id: record.panic_id, module: 'panic'}), request),
        created_at: record.created_at,
        updated_at: record.updated_at,
      }
  }

}
module.exports = WitnessShort;
