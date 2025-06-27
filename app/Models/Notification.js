'use strict';

const Model  = use('Model');
const _      = use('lodash');
const crypto = use('crypto');
const Config = use('Config');
const PushNotification = use('App/Libraries/PushNotification/Index.js')

class Notification extends Model
{
    static get table()
    {
      return "notifications";
    }

    static get createdAtColumn () {
      return 'created_at';
    }

    static get updatedAtColumn () {
      return 'updated_at';
    }

    static getFields()
    {
        return [
           'unique_id','identifier','actor_id','target_id','module','module_id','module_slug',
           'reference_module','reference_id','reference_slug','title','description','web_redirect_link',
           'is_read','is_view','created_at','updated_at','deleted_at'
        ];
    }

    static showColumns()
    {
        return [
          'unique_id','identifier','actor_id','target_id','module','module_id','module_slug',
          'reference_module','reference_id', 'is_star','reference_slug','title','description','web_redirect_link',
          'is_read','is_view','created_at'
      ];
    }

    actor()
    {
        return this.belongsTo('App/Models/User','actor_id','id');
    }

    /**
     * Get user notification
     * @param {adonis request} request
     */
    static async getNotifications(request)
    {
        let user   = request.user();
        let params = request.all();
        let record_limit = _.isEmpty(params["limit"]) ? Config.get("constants.pagination_limit") : parseInt(params["limit"]);
        let query = this.query().whereNull('deleted_at').with('actor').select(this.showColumns()).where('target_id',user.id).orderBy('created_at', 'desc');

        if(params.is_star) {
          query.where('is_star', params.is_star);
        }

        query = await query.paginate(_.isEmpty(params['page']) ? 1 : params['page'], record_limit)
        return query.toJSON();
    }

    static async getNotificationByUniqueId(unique_id)
    {
      let notification = await this.query().where('unique_id', unique_id).whereNull('deleted_at').with('actor').first();
      if (_.isEmpty(notification)) {
        return null;
      }
      return notification.toJSON();
    }

    static async getCount(condition) {
      let count = await this.query().where(condition).whereNull('deleted_at').count()
  
      let total = count[0]['count(*)']
      return total
    }

    static async updateNotification(condition, data) {
      await this.query().where(condition).update(data);
      return true;
    }

    /**
     *
     * @param {string} identifier
     * @param {object} notification_data
     * @param {object} customData
     * @param {string} device_type
     * @returns
     */
    static async sendPushNotification(identifier, notification_data, customData = {}, in_app, is_push, sound) {
      let device_token_android_arr = [];
      let device_token_ios_arr = [];
      let device_token_web_arr = []
      let user_ids = [];
      let target_user = notification_data.target;
      
      for (var i = 0; i < target_user.length; i++) {
        user_ids.push(target_user[i].id);
        if (target_user[i].api_token.device_type == 'android') {
          device_token_android_arr.push(target_user[i].api_token.device_token)
        } else if (target_user[i].api_token.device_type == 'ios') {
          device_token_ios_arr.push(target_user[i].api_token.device_token)
        } else {
          device_token_web_arr.push(target_user[i].api_token.device_token)
        }
      }
      device_token_android_arr = _.uniq(device_token_android_arr);
      device_token_ios_arr = _.uniq(device_token_ios_arr);
      device_token_web_arr = _.uniq(device_token_web_arr);
      user_ids = _.uniq(user_ids);
  
      let unique_id = crypto.randomBytes(16).toString("hex");
      customData.unique_id = unique_id;
  
      // check is_push
      if (is_push == '1') {
        //send push notification to android
        if (device_token_android_arr.length > 0) {
          PushNotification.notification(
            device_token_android_arr,
            'android',
            notification_data.title,
            notification_data.message,
            notification_data.badge,
            notification_data.redirect_link,
            customData,
            sound
          );
        }
        //send push notification to ios
        if (device_token_ios_arr.length > 0) {
          PushNotification.notification(
            device_token_ios_arr,
            'ios',
            notification_data.title,
            notification_data.message,
            notification_data.badge,
            notification_data.redirect_link,
            customData,
            sound
          );
        }
        //send push notification to web
        if (device_token_web_arr.length > 0) {
          PushNotification.notification(
            device_token_web_arr,
            'web',
            notification_data.title,
            notification_data.message,
            notification_data.badge,
            notification_data.redirect_link,
            customData,
            sound
          );
        }      
      }
      //insert notification data into db
      let notification_param = [];
      for (var u = 0; u < user_ids.length; u++) {
        notification_param.push({
          unique_id: unique_id,
          identifier: identifier,
          actor_id: notification_data.actor.id,
          target_id: user_ids[u],
          module: notification_data.module,
          module_id: notification_data.module_id,
          module_slug: notification_data.module_slug,
          reference_module: _.isEmpty(notification_data.reference_module) ? null : notification_data.reference_module,
          reference_id: _.isEmpty(notification_data.reference_id) ? null : notification_data.reference_id,
          reference_slug: _.isEmpty(notification_data.reference_slug) ? null : notification_data.reference_slug,
          title: notification_data.title,
          description: notification_data.message,
          web_redirect_link: _.isEmpty(notification_data.redirect_link) ? null : notification_data.redirect_link,
          created_at: new Date()
        })
      }
      if (in_app == true){
        await this.query().insert(notification_param);
      }
      return true;
    }
  
}
module.exports = Notification;
