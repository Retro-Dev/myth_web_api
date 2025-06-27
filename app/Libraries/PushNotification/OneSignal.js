'use strict'

const Env = use('Env');
const Antl = use('Antl')
const HttpClient = use('App/Libraries/HttpRequest/Index.js')

class OneSignal
{
    sendPush(device_tokens,device_type,title,message,badge,redirect_link,custom_data)
    {
        let language = Antl.currentLocale();
        let params = {
            app_id: Env.get('NOTIFICATION_APP_ID'),
            include_player_ids: device_tokens,
            channel_for_external_user_ids: 'push',
            data:{
                title: title,
                message: message,
                badge: badge,
                custom_data: custom_data
            },
            headings: { [language]: title },
            contents: { [language]: message },
            isIos: device_type == 'ios' ? true : false,
            ios_badgeType: 'Increase',
            ios_badgeCount: badge,
        }
        if( device_type == 'web' )
          params.url = redirect_link

        let headers = {
          'Content-Type':'application/json',
          'charset':'utf-8',
          'Authorization': 'Basic ' + Env.get('NOTIFICATION_KEY')
        }
        HttpClient.makeRequest('post',Env.get('NOTIFICATION_URL'),params,headers)
          .then( (res) => {
              //console.log('push notification',res);
          });
    }
}
module.exports = OneSignal;
