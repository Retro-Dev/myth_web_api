const Env = use('Env');
const Antl = use('Antl')
const HttpClient = use('App/Libraries/HttpRequest/Index.js')
const util = use('util')
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const { data } = require("jquery");

let firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
},
  Env.get('APP_NAME')
);

class FCM {
  sendPush(device_tokens, device_type, title, message, badge, redirect_link, custom_data, sound) {
    if (device_type == 'ios') {
      if (sound === 'default') {
        return this.sendIosPushNotification(device_tokens, device_type, title, message, badge, redirect_link, custom_data, sound);
      }
      return this.sendIosPushNotification(device_tokens, device_type, title, message, badge, redirect_link, custom_data, `${sound}.caf`);
    } else {
      if (sound === 'default') {
        return this.sendAndroidPushNotification(device_tokens, device_type, title, message, badge, redirect_link, custom_data, sound);
      } else if(sound === 'emergency') {
      return this.sendAndroidPushNotification(device_tokens, device_type, title, message, badge, redirect_link, custom_data, `${sound}`);
      }
      return this.sendAndroidPushNotification(device_tokens, device_type, title, message, badge, redirect_link, custom_data, `${sound}.wav`);
    }
  }

  sendIosPushNotification(device_tokens, device_type, title, message, badge, redirect_link, custom_data, sound) {
    firebaseAdmin.messaging().send({
      token: device_tokens[device_tokens.length - 1],
      notification: {
        title,
        body: message,
      },
      data: {
        custom_data: JSON.stringify(custom_data),
      },
      apns: {
        payload: {
          aps: {
            sound: sound,
          }
        }
      }
    }).then((res) => {
      console.log('<--------ios res-------->', res);
    }).catch((error) => {
      console.log('<--------ios error-------->', error.message);
    })
    return true;
  }

  sendAndroidPushNotification(device_tokens, device_type, title, message, badge, redirect_link, custom_data, sound) {
    let data
    let android

    data = {
      custom_data: JSON.stringify(custom_data),
    }

    if (sound === 'default') {
    } else{ 
      android = {
        notification: {
          sound: sound,
          // android_channel_id: sound,
          channelId: sound,
        },
        data: {
          // message: JSON.stringify({
          //   android_channel_id: sound,
          // }),
          custom_data: JSON.stringify(custom_data),
        }
      }
    }

    firebaseAdmin.messaging().send({
      token: device_tokens[device_tokens.length - 1],
      notification: {
        title,
        body: message,
      },
      data: data,
      android: android
    }).then((res) => {
      console.log('<--------andoird res-------->', res);
    }).catch((error) => {
      console.log('<--------android error-------->', error.message);
    })

    return true;
  }

  sendCurl(notification_data) {


    let headers = {
      'Authorization': 'Bearer ' + Env.get('NOTIFICATION_KEY'),
      'Content-Type': 'application/json',
      'charset': 'utf-8'
    }
    HttpClient.makeRequest('post', Env.get('NOTIFICATION_URL'), notification_data, headers)
      .then((res) => {
        console.log('<--------res-------->', util.inspect(res, false, null, true /* enable colors */));

      });
    return true;
  }
}
module.exports = FCM;
