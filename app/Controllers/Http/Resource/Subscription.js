'use strict'

const _ = use('lodash');
const {baseUrl} = use("App/Helpers/Index.js");
const UserShort = use('App/Controllers/Http/Resource/UserShort.js')

class Subscription
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
        original_transaction_id: record.original_transaction_id,
        transaction_id: record.transaction_id,
        user: await UserShort.initResponse(record.user, request),
        expiry_date: record.expiry_date,
        gateway_type: record.gateway_type,
        gateway_response: JSON.parse(record.gateway_response),
        subscription_id: record.subscription_id,
        purchase_date: record.purchase_date,
        amount: record.amount,
        created_at: record.created_at,
        updated_at: record.updated_at
      }
  }

}
module.exports = Subscription;
