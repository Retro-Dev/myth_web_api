'use strict'

const _ = use('lodash');
const { baseUrl, storageUrl } = use("App/Helpers/Index.js");
const UserShort = use('App/Controllers/Http/Resource/UserShort.js')

class Media {
  static async initResponse(data, request) {
    if (_.isEmpty(data))
      return [];

    let response;
    if (Array.isArray(data)) {
      response = []
      for (var i = 0; i < data.length; i++) {
        response.push(await this.jsonSchema(data[i], request));
      }
    } else {
      response = await this.jsonSchema(data, request)
    }
    return response;
  }

  static async jsonSchema(record, request) {   
    // temporary thumbnail
    // record.thumbnail_url = baseUrl('/uploads/video-thumbnail/thumbnail-68050.jpg')
    
    return {
      id: record.id,
      file_url: record.file_url,
      file_url_blur: record.file_url_blur,
      slug: record.slug,
      file_type: record.file_type,
      thumbnail_url: record.file_type == 'video' ? baseUrl('/'+record.thumbnail_url): null,
      duration_ms: record.duration_ms,
      is_admin: record.is_admin,
      created_at: record.created_at,
      user: await UserShort.initResponse(record.user, request)
    }
  }

}
module.exports = Media;
