'use strict'

const Env = use('Env');

class Index
{
    /**
     *
     * @param {array} $device_tokens
     * @param {string} $device_type | ios, android, web
     * @param {string} $title
     * @param {string} $message
     * @param {int} $badge
     * @param {string} $redirect_link
     * @param {object} $custom_data
     */
    static notification(
      device_tokens,
      device_type,
      title,
      message,
      badge = 0,
      redirect_link = '',
      custom_data = {},
      sound
    )
    {
      let driver   = Env.get('NOTIFICATION_DRIVER');
      let instance =  use(`App/Libraries/PushNotification/${driver}.js`);
          instance = new instance;

      return instance.sendPush(device_tokens,device_type,title,message,badge,redirect_link,custom_data, sound);
    }
}
module.exports = Index
