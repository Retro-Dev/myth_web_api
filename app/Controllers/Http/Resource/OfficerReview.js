'use strict'

const _ = use('lodash');
const {baseUrl} = use("App/Helpers/Index.js");
const PublicUser = use('App/Controllers/Http/Resource/PublicUser.js')
const PoliceOfficer = use('App/Controllers/Http/Resource/PoliceOfficer.js')
const util = use('util')

class OfficerReview
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
        rate: +(parseFloat(record.rate).toFixed(2)),
        review: record.review,
        created_at: record.created_at,
        timestamp: new Date(record.created_at.replace(' ', 'T')).getTime(),
        user: await PublicUser.initResponse(record.user, request),
        officer: await PoliceOfficer.initResponse(record.policeOfficer, request),
      }
  }

}
module.exports = OfficerReview;
