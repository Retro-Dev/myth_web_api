'use strict'

const _ = use('lodash');
const UserResource = use('./User.js');
const { baseUrl } = use("App/Helpers/Index.js");

class Notification {
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
    let UserObj = await UserResource.initResponse(record.actor, request)
    
    
    // check is actor admin or not
    if (record?.actor?.user_group_id == '1') {
      UserObj.image_url = baseUrl('/images/logo-2.jpg')
    }
    
    let newInputDate = record.created_at.replace(" ", "T");
    let timestamp = new Date(newInputDate).getTime();
    
    // set UserObj.name to UserObj.pseodo_name if user.pseodo_name is 1
    if (record?.actor?.is_pseudo_name == 1) {
      UserObj.name = UserObj.pseudo_name
    }
    return {
      id: record._id,
      unique_id: record.unique_id,
      identifier: record.identifier,
      actor_id: record.actor_id,
      actor_type: record.actor_type,
      actor: UserObj,
      module: record.module,
      module_id: record.module_id,
      reference_module: record.reference_module,
      reference_id: record.reference_id,
      reference_slug: record.reference_slug,
      title: record.title,
      description: record.description,
      web_redirect_link: record.web_redirect_link,
      is_read: record.is_read,
      is_star: record.is_star,
      created_at: record.created_at,
      timestamp: timestamp
    }
  }

}
module.exports = Notification;
