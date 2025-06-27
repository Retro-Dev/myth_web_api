'use strict'

const _ = use('lodash');
const {baseUrl} = use("App/Helpers/Index.js");

class AdminAuth
{
  constructor()
  {
      this.headers = {};
  }

  static async initResponse(data,request)
  {
      if( _.isEmpty(data) )
        return [];

      this.headers = request.headers();
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
      let image_url = null;
      let api_token = _.isEmpty(this.headers.authorization)
                      ? Buffer.from(request.apiToken()).toString('base64')
                      : Buffer.from(request.authorization()).toString('base64');

      if( record.image_url != null && record.image_url != '' ){
          if( record.image_url.startsWith('http') ){
            image_url = record.image_url
          } else {
            image_url = baseUrl() + record.image_url;
          }
      } else {
        image_url = baseUrl() + '/images/user-placeholder.jpg'
      }
      return {
          id: record._id,
          role: record.CmsRole,
          user_type: record.user_type,
          name: record.name,
          username: record.username,
          slug: record.slug,
          email: record.email,
          mobile_no: record.mobile_no,
          api_token: api_token,
          image_url: image_url,
          is_mobile_verify:record.is_mobile_verify,
          is_email_verify:record.is_email_verify,
          platform_type:record.platform_type,
          status:record.status,
          created_at: record.created_at,
          cms_modules: record.cms_modules
      }
  }

}
module.exports = AdminAuth;
