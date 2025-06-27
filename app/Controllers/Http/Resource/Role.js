'use strict'

const _ = use('lodash');
const {baseUrl} = use("App/Helpers/Index.js");

class Role
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
      return {
        id: record._id,
        title: record.title,
        slug: record.slug,
        is_super_admin:record.is_super_admin == 0 || record.is_super_admin  == false ? false : true,
        status: record.status,
        created_at: record.created_at,
        cms_module: record.cms_module
      }
  }

}
module.exports = Role;
