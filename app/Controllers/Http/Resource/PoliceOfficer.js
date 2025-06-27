'use strict'

const _ = use('lodash');
const {baseUrl} = use("App/Helpers/Index.js");
const UserShort = use('App/Controllers/Http/Resource/UserShort.js')
const OfficerReviewModel = use('App/Models/OfficerReview')

class PoliceOfficer
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
        description: record.description,
        image_url: record.image_url,
        city: record.city,
        state: record.state,
        rating_avg: +parseFloat(await OfficerReviewModel.getAverageRating({officer_id: record.id})).toFixed(2),
        total_reviews: record?.officerReviews?.length,
        created_at: record.created_at,
        timestamp: new Date(record.created_at.replace(' ', 'T')).getTime(),
        user: await UserShort.initResponse(record.user, request),
        // category: await Category.initResponse(record.directoryCategories, request),
        // review: await ReviewShort.initResponse(record.reviews, request),
      }
  }

}
module.exports = PoliceOfficer;
