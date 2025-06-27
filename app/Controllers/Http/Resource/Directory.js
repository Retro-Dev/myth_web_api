'use strict'

const _ = use('lodash');
const {baseUrl} = use("App/Helpers/Index.js");
const Category = use('App/Controllers/Http/Resource/Category.js')
const ReviewShort = use('App/Controllers/Http/Resource/ReviewShort.js')

class Directory
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
        name: record.name,
        badge_no: record.badge_no,
        status: record.status,
        department: record.department,
        image_url: record.image_url,
        rating_avg: record.rating_avg,
        total_reviews: record.total_reviews,
        created_at: record.created_at,
        timestamp: new Date(record.created_at.replace(' ', 'T')).getTime(),
        category: await Category.initResponse(record.directoryCategories, request),
        // review: await ReviewShort.initResponse(record.reviews, request),
      }
  }

}
module.exports = Directory;
