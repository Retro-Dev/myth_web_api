'use strict'

const moment = require("moment");
const Env = use('Env');
const Mail = use('Mail');
const Antl = use('Antl');
const Helpers  = use('Helpers')
const ffmpeg   = use('fluent-ffmpeg');
const fs       = use('fs');
const _ = use('lodash');
const Drive = use('Drive');
const Notification = use('App/Models/Notification');

const strSlug = (string) => {
  return string
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[-]+/g, "-")
    .replace(/[^\w-]+/g, "");
  return string;
}

const kebabCase = (string) => {
  return string.split('').map((letter, idx) => {
    return letter.toUpperCase() === letter
      ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
      : letter;
  }).join('');
}

const baseUrl = (path = '/') => {
  return Env.get('BASE_URL') + path;
}

const appUrl = (path = '/') => {
  return Env.get('APP_URL') + path;
}

const storageUrl = (path) => {
  return Env.get('FILESYSTEM') == 's3' ? Drive.getUrl(path) : baseUrl(`/uploads/${path}`);
}

const randomString = (length = 8) => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const generateVideoThumb = (file_path, destination_path) => {
  return new Promise((resolve, reject) => {
    try {
      //create thumbnail tmp dir
      let dir = Helpers.publicPath(destination_path);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir,'777');
      }
      //set ffmpeg path
      ffmpeg.setFfmpegPath(Env.get('FFMPEG_BINARIES'))
      ffmpeg.setFfprobePath(Env.get('FFPROBE_BINARIES'))
      //thumbnail name
      let thumbnail_name = 'thumbnail-' + randomString(10) + '.png';
       ffmpeg(file_path)
        .on('end', async function () {
          //save file to disk
          let thumbnail_path = dir + '/' + thumbnail_name;
          let contents = fs.readFileSync(thumbnail_path)
           await Drive.put(`${destination_path}/${thumbnail_name}`, contents)
          // fs.unlinkSync(`${dir}/${thumbnail_name}`);
           resolve(`${destination_path}/${thumbnail_name}`);
        })
        .screenshots({
          count: 1,
          filename: thumbnail_name,
          folder: dir, //Helpers.publicPath('uploads/video-thumbnail'),
          size: '320x240'
        });
    } catch (error) {
      reject(error.message);
    }
  })
}

const videoDuration = (file_path) => {
  return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(file_path, function(err, metadata) {
          resolve(metadata.format.duration * 1000)
      });
  })
}

const rand = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const sendMail = async (email_view_path, to, subject, params) => {
  await Mail.send(email_view_path, params, (message) => {
    message
      .to(to)
      .from(Env.get('MAIL_FROM'), Env.get('MAIL_FROM_NAME'))
      .subject(subject)
  })
}

const momentNow = () => {
  return moment.utc().format();
}

const fileValidation = (file, sizeInKB = 20000000, extensions = ['png', 'jpg', 'jpeg']) => {
  let data = {
    error: false
  };
  // if (file.size > sizeInKB) {
  //   data.error = true;
  //   data.message = Antl.formatMessage('messages.file_size_validation')
  // }
  if (!extensions.includes(file.extname)) {
    data.error = true;
    data.message = Antl.formatMessage('messages.file_ext_validation')
  }
  if (!_.isEmpty(file.error)) {
    data.error = true;
    data.message = file.error;
  }
  return data;
}
const formatPhoneNumberToE164 = (phone_no) => {
  // Remove non-numeric characters from the phone number
  const numericPhoneNumber = phone_no.replace(/\D/g, '');

  // Check if the phone number starts with the country code '1'
  if (numericPhoneNumber.startsWith('1')) {
    // If it starts with '1', remove the '1' and proceed
    return `+1${numericPhoneNumber.slice(1)}`;
  } else {
    // If it doesn't start with '1', assume it's a 10-digit number and add the country code
    return `+1${numericPhoneNumber}`;
  }
}

const sendPushNotification = async (module, title, message, record, reference_id,reference_module,reference_slug,identifier, actor, target, data = {}, in_app = true, is_push = '1', sound = 'default') => {
  // console.log('<--------target-------->',target);
  
  // let notification_count = await Notification.getCount({ target_id: target[0].id, is_badge: '1' })
  
  // let room_count = 0
  // if (target[0].role == 'user') {
  //   room_count = await Room.getCount({ user_id: target[0].id, is_badge_user: '1' })
  // } else {
  //   room_count = await Room.getCount({ owner_id: target[0].id, is_badge_owner: '1' })
  // }

  // notification_count = parseInt(notification_count) + parseInt(room_count) + parseInt(1)
    
  // send notification
  let notification_data = {
    actor: actor,
    target: target,
    module: module,
    module_id: record?.id,
    module_slug: record?.slug,
    reference_id: reference_id,
    reference_module: reference_module,
    reference_slug: reference_slug,
    title: title,
    message: message,
    redirect_link: '',
    is_badge: '1',

  }
  let custom_data = {
    reference_id: reference_id,
    reference_module: reference_module,
    reference_slug: reference_slug,
    identifier: identifier,
    // badge: notification_count,
    ...data
  }
  await Notification.sendPushNotification(identifier, notification_data, custom_data, in_app, is_push, sound);
}

module.exports = {
  baseUrl,
  strSlug,
  kebabCase,
  randomString,
  generateVideoThumb,
  videoDuration,
  sendMail,
  momentNow,
  rand,
  fileValidation,
  storageUrl,
  sendPushNotification,
  formatPhoneNumberToE164
}
