'use strict'

const Env = use('Env');

module.exports = {

    LOGIN_AUTH_TOKEN: 'zekkmdvhkm',

    JWT_SECRET: Env.get('JWT_SECRET'),

    JWT_EXPIRY: "7d", // for 7 days

    CLIENT_ID: Env.get('CLIENT_ID'),

    AES_SECRET: Env.get('AES_SECRET'), //256bit

    APP_NAME: Env.get('APP_NAME'),

    pagination_limit: 20,

    REDIS_CACHE_ENABLE:false,

    REDIS_CACHE_EXPIRE_TIME: 3600,

    APP_SETTING_IMAGE_PATH: 'images/'
}
