'use strict'

const _ = use('lodash');
const {baseUrl} = use("App/Helpers/Index.js");

class CmsModule
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
        let user = request.user();
        return {
            id: record._id,
            name: record.name,
            route_path: record.route_path,
            icon: record.icon,
            created_at: record.created_at,
            is_add: user.CmsRole.slug == 'super-admin' ? true : record.is_add,
            is_view: user.CmsRole.slug == 'super-admin' ? true : record.is_view,
            is_update: user.CmsRole.slug == 'super-admin' ? true : record.is_update,
            is_delete: user.CmsRole.slug == 'super-admin' ? true : record.is_delete,
        }
    }
}
module.exports = CmsModule;
