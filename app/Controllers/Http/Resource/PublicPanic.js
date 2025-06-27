'use strict'

const _ = use('lodash');
const Witness = use('App/Models/Witness');
const UserShort = use('App/Controllers/Http/Resource/UserShort.js')
const MediaShort = use('App/Controllers/Http/Resource/MediaShort.js')
const util = use('util')
const WitnessShort = use('App/Controllers/Http/Resource/WitnessShort.js')

class PublicPanic {
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
    let witness = []
    if (request) {
      witness = await Witness.getWitness({ panic_id: record.id, user_id: request.user().id })      
    }
    return {
      id: record.id,
      current_location: {
        latitude: Number(record.latitude),
        longitude: Number(record.longitude),
      },
      slug: record.slug,
      agora_token: record.agora_token,
      is_witness: !_.isEmpty(witness) ? true: false,
      media: await MediaShort.initResponse(record.media, request),
      created_at: record.created_at,
      updated_at: record.updated_at,
    }
  }

}
module.exports = PublicPanic;
