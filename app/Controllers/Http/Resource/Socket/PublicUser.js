'use strict'

const _ = use('lodash');
const {baseUrl,storageUrl} = use("App/Helpers/Index.js");
const PanicModel = use('App/Models/Panic');
const PublicPanic = use('App/Controllers/Http/Resource/PublicPanic.js')

class PublicUser
{
  constructor()
  {
      this.headers = {};
  }

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
      let image_url  = null;
      let blur_image = null;

      if( record.image_url != null && record.image_url != '' ){
          if( record.image_url.startsWith('http') ){
            image_url = record.image_url
          } else {
            image_url = storageUrl(record.image_url);
          }
          blur_image = record.blur_image;
      } else {
        image_url = baseUrl('/images/user-placeholder.jpg')
        // blur_image = 'L5Mj]zRj00%M00WB4nt7_3t7~qRj';
      }
      return {
          id: record.id,
          name: record.is_pseudo_name == '1' ? record.pseudo_name: record.name,
          slug: record.slug,
          current_location: {
            latitude: Number(record.latitude),
            longitude: Number(record.longitude),
          },
          is_panic: record.is_panic,
          image_url: image_url,
          blur_image: blur_image,
          panic: await PublicPanic.initResponse(record.panicSocket, request),
      }
  }

}
module.exports = PublicUser;
