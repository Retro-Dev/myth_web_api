'use strict'

const _ = use('lodash');
const {baseUrl} = use("App/Helpers/Index.js");

class UserShort
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
    let image_url  = null;
    let blur_image = null;

    if( record.image_url != null && record.image_url != '' ){
        if( record.image_url.startsWith('http') ){
          image_url = record.image_url
        } else {
          image_url = record.image_url;
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
        mobile_no: record.mobile_no,
        address: record.address,
        current_location: {
          latitude: Number(record.latitude),
        longitude: Number(record.longitude),
        },
        is_panic: record.is_panic,
        radius_mi: record.radius_mi,
        image_url: image_url,
        blur_image: blur_image,
        socket: record.socket,
      }
  }

}
module.exports = UserShort;
