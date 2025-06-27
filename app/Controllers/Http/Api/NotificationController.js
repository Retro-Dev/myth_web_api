'use strict';

const Controller = require("../Controller");
const User = use('App/Models/User');
const Notification = use('App/Models/Notification');
const Antl = use('Antl');
const { sendPushNotification } = use("App/Helpers/Index.js");
const { validateAll, rule } = use("Validator");
const util = use('util')
const {baseUrl,storageUrl} = use("App/Helpers/Index.js");

class NotificationController extends Controller {
    constructor() {
        super();
        this.resource = "Notification"; //this is your resource name
        this.request; //adonis request obj
        this.response; //adonis response obj
        this.params = {}; // this is used for get parameters from url
    }

    async index({ request, response }) {
        this.request = request;
        this.response = response;
        let records = await Notification.getNotifications(request);

        // update notification
        await Notification.updateNotification({ target_id: request.user().id }, { is_badge: '0' })
        this.sendResponse(
            200,
            Antl.formatMessage('messages.success_listing_message'),
            records
        );
        return;
    }

    async updateNotification({ request, response }) {
        this.request = request;
        this.response = response;
        let params = request.all()
        let data = {}
        let unique_id = request.params.unique_id
        if(params.is_star) {
            data = {
                is_star: params.is_star
            }
        }
        
        // update notification
        await Notification.updateNotification({ target_id: request.user().id, unique_id: unique_id }, data)

        const notification = await Notification.getNotificationByUniqueId(unique_id)

        this.__collection = true
        this.__is_paginate = false
        this.sendResponse(
            200,
            Antl.formatMessage('messages.success_update_message'),
            notification
        );
        return;
    }

    async deleteNotification({ request, response }) {
        this.request = request;
        this.response = response;

        let unique_id = request.params.unique_id
        if (unique_id == undefined || unique_id == null || unique_id == '') {
            this.sendResponse(
                400,
                Antl.formatMessage('messages.validation_msg'),
                Antl.formatMessage('messages.validation_unique_id')
            );
            return;
        }

        // update notification
        await Notification.updateNotification({ target_id: request.user().id, unique_id: unique_id, is_star: '0' }, { deleted_at: new Date() })

        this.sendResponse(
            200,
            Antl.formatMessage('messages.success_delete_message'),
            []
        );
        return;
    }

    async deleteAllNotification({ request, response }) {
        this.request = request;
        this.response = response;

        // update notification
        await Notification.updateNotification({ target_id: request.user().id, is_star: '0' }, { deleted_at: new Date() })

        this.sendResponse(
            200,
            Antl.formatMessage('messages.success_delete_message'),
            []
        );
        return;
    }

    async starNotification({ request, response }) {
        this.request = request;
        this.response = response;

        let unique_id = request.params.unique_id
        if (unique_id == undefined || unique_id == null || unique_id == '') {
            this.sendResponse(
                400,
                Antl.formatMessage('messages.validation_msg'),
                Antl.formatMessage('messages.validation_unique_id')
            );
            return;
        }

        // update notification
        await Notification.updateNotification({ target_id: request.user().id, unique_id: unique_id }, { is_star: '1' })

        this.sendResponse(
            200,
            Antl.formatMessage('messages.success_update_message'),
            []
        );
        return;
    }

    async dashboardStatus({ request, response }) {
        this.request = request;
        this.response = response;

        let user = request.user()
        let room_count

        let notification_count = await Notification.getCount({ target_id: user.id, is_badge: '1' })

        this.__is_paginate = false;
        this.__collection = false
        await this.sendResponse(
            200,
            Antl.formatMessage('messages.login_success'),
            { room_count, notification_count }
        );
        return;
    }

    async sendNotification({ request }) {
        let params = request.all();
        let actor = request.user();
        let target = await User.query()
            .select('users.*', 'uat.device_type', 'uat.device_token')
            .innerJoin('user_api_tokens AS uat', 'uat.user_id', 'users.id')
            .where('users.id', params.target_id)
            .fetch();
        target = target.toJSON();
        let notification_data = {
            actor: actor,
            target: target,
            module: 'users',
            module_id: actor.id,
            module_slug: actor.slug,
            reference_id: null,
            reference_module: null,
            reference_slug: null,
            title: 'AdonisJS',
            message: 'Testing push notification',
            redirect_link: null,
            badge: 0,
        }
        let custom_data = {
            record_id: actor.id,
            redirect_link: null,
            identifier: 'add_user'
        }
        let record = await Notification.sendPushNotification('add_user', notification_data, custom_data);
        return record;
    }

    async sendChatNotification({ request }) {
        let params = request.all();
        let actor = request.user()

        let image_url  = null;
  
        if( actor.image_url != null && actor.image_url != '' ){
            if( actor.image_url.startsWith('http') ){
              image_url = actor.image_url
            } else {
              image_url = storageUrl(actor.image_url);
            }
        } else {
          image_url = baseUrl('/images/user-placeholder.jpg')
        }

        let user = await User.getUser({ id: actor.id })

        // send push 
        let target = await User.getUserWToken({id: params.target_id})
        
        let reference_id = params.chat_room_id
        let reference_module = params.identifier
        let reference_slug = params.chat_room_id
        let identifier = params.identifier
        let title = 'Myth'
        let message = user.is_pseudo_name == '0' ? `${actor.name} has messaged you.`: `${user.pseudo_name} has messaged you.`
        let module = "chats"
        let record = null
        let data = {
            user: {
                _id: actor.id,
                avtar: image_url,
                name: actor.name
            }
        }
        let in_app = false
        let is_push = target.is_notification
        await sendPushNotification(module, title, message, record, reference_id, reference_module, reference_slug, identifier, actor, target, data, in_app, is_push)

        return true;
    }

    async readNotification({ request, response }) {
        this.request = request;
        this.response = response;

        let params = request.all()

        let rules = {
            "unique_id": 'required',
        }
        let validator = await validateAll(request.all(), rules);
        let validation_error = this.validateRequestParams(validator);
        if (this.__is_error)
            return validation_error;

        // update notification
        await Notification.updateNotification({ target_id: request.user().id, unique_id: params.unique_id }, { is_read: '1' })

        this.sendResponse(
            200,
            Antl.formatMessage('messages.success_update_message'),
            []
        );
        return;
    }


}
module.exports = NotificationController
