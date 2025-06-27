'use strict'

const _ = use('lodash');
const { baseUrl, storageUrl } = use("App/Helpers/Index.js");
const UserShort = use('App/Controllers/Http/Resource/UserShort.js')
const MediaShort = use('App/Controllers/Http/Resource/MediaShort.js')
const WitnessShort = use('App/Controllers/Http/Resource/WitnessShort.js')
const Witness = use('App/Models/Witness');
const util = use('util')

class Panic {
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
    let newInputDate = record.created_at.replace(" ", "T");
    let timestamp = new Date(newInputDate).getTime();
    let thumbnail_url
    if (record.thumbnail_url != null && record.thumbnail_url != '') {
      if (record.thumbnail_url.startsWith('http')) {
        thumbnail_url = record.thumbnail_url
      } else {
        thumbnail_url = storageUrl(record.thumbnail_url);
      }
      // blur_image = record.blur_image;
    } else {
      thumbnail_url = baseUrl('/images/logo-2.jpg')
      // blur_image = 'L5Mj]zRj00%M00WB4nt7_3t7~qRj';
    }
    let witness = []
    if (request) {
      witness = await Witness.getWitness({ panic_id: record.id, user_id: request.user().id })      
    }
    return {
      id: record.id,
      current_location: {
        latitude: Number(record.latitude),
        longitude: Number(record.longitude),
        address: record.address,
      },
      slug: record.slug,
      is_witness: !_.isEmpty(witness) ? true: false,
      agora_token: record.agora_token,
      file_url: record.file_url,
      thumbnail_url: thumbnail_url,
      is_end: record.is_end,
      start_panic_time_ms: record.start_panic_time_ms,
      end_panic_time_ms: record.end_panic_time_ms,
      panic_duration_ms: record.panic_duration_ms,
      created_at: record.created_at,
      updated_at: record.updated_at,
      media: await MediaShort.initResponse(record.media, request),
      user: await UserShort.initResponse(record.user, request),
      witness: await WitnessShort.initResponse(record.witness, request),
      is_witness: !_.isEmpty(witness) ? true: false,
      timestamp: timestamp
    }
  }

}
module.exports = Panic;
