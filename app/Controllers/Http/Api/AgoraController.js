'use strict'

const { validateAll, rule } = use("Validator");
const RestController = require("../RestController");
const Env = use('Env');
const { RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole } = require('agora-token')
const Antl = use("Antl");

class AgoraController extends RestController
{
    constructor()
    {
        super('Agora'); //this is your model name
        this.resource = "Agora"; //this is your resource name
        this.request; //adonis request obj
        this.response; //adonis response obj
        this.params = {}; // this is used for get parameters from url
    }

    /**
     * This function is used for validate restfull request
     * @param $action
     * @param string $slug
     * @return validator response
     */
    async validation(action, slug = '')
    {
        let validator = [];
        let rules;
        switch (action) {
            case "store":
              rules = {
              }
              validator = await validateAll(this.request.all(), rules)
              break;
            case "update":
                rules = {
                }
                validator = await validateAll(this.request.all(), rules);
                break;
        }
        return validator;
    }

    /**
     * This function loads before a model load
     * @param {adonis request object} this.request
     * @param {adonis response object} this.response
     */
    async beforeIndexLoadModel()
    {

    }

    /**
     * This function loads before response send to client
     * @param {adonis request object} this.request
     * @param {adonis response object} this.response
     */
    async afterIndexLoadModel()
    {

    }

    /**
     * This function loads before a model load
     * @param {adonis request object} this.request
     * @param {adonis response object} this.response
     */
    async beforeStoreLoadModel()
    {

    }

    /**
     * This function loads before response send to client
     * @param {object} record
     * @param {adonis request object} this.request
     * @param {adonis response object} this.response
     */
    async afterStoreLoadModel(record)
    {

    }

   /**
     * This function loads before a model load
     * @param {adonis request object} this.request
     * @param {adonis response object} this.response
     * @param {adonis param object} this.params
     */
    async beforeShowLoadModel()
    {

    }

    /**
     * This function loads before response send to client
     * @param {object} record
     * @param {adonis request object} this.request
     * @param {adonis response object} this.response
     * @param {adonis param object} this.params
     */
    async afterShowLoadModel(record)
    {

    }

    /**
     * This function loads before a model load
     * @param {adonis request object} this.request
     * @param {adonis response object} this.response
     * @param {adonis param object} this.params
     */
    async beforeUpdateLoadModel()
    {

    }

   /**
     * This function loads before response send to client
     * @param {object} record
     * @param {adonis request object} this.request
     * @param {adonis response object} this.response
     * @param {adonis param object} this.params
     */
    async afterUpdateLoadModel(record)
    {

    }

    /**
     * This function loads before a model load
     * @param {adonis request object} this.request
     * @param {adonis response object} this.response
     * @param {adonis param object} this.params
     */
    async beforeDestoryLoadModel()
    {

    }

    /**
     * This function loads before response send to client
     * @param {object} record
     * @param {adonis request object} this.request
     * @param {adonis response object} this.response
     * @param {adonis param object} this.params
     */
    async afterDestoryLoadModel()
    {

    }

    static async generateToken(data) {
      // Rtc Examples
      const appID = Env.get('APP_ID');
      const appCertificate = Env.get('APP_CERTIFICATE');
      const channelName = data.channel_name;
      const uid = data.uid;
      const role = RtcRole.PUBLISHER;


      const expirationTimeInSeconds = 50000

      const currentTimestamp = Math.floor(Date.now() / 1000)

      const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

      // IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.

      // Build token with uid

      let token = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs);
      return token
  }

  static async generateTokenSubscriber(data) {
    // Rtc Examples
    const appID = Env.get('APP_ID');
    const appCertificate = Env.get('APP_CERTIFICATE');
    const channelName = data.channel_name;
    const uid = data.uid;
    const role = RtcRole.SUBSCRIBER;


    const expirationTimeInSeconds = 50000

    const currentTimestamp = Math.floor(Date.now() / 1000)

    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

    // IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.

    // Build token with uid

    let token = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs);
    return token
}


}
module.exports = AgoraController
