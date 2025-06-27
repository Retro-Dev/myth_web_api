'use strict'

const User = use('App/Models/User');
const Contact = use('App/Models/Contact');
const Hash = use('Hash');
const Encryption = use('Encryption');
const _ = use('lodash');
const Env = use('Env');
const Database = use('Database')
const Request = use('Adonis/Src/Request')
const { strSlug, sendMail, baseUrl } = use("App/Helpers/Index.js");
const FileUpload = use('App/Libraries/FileUpload/FileUpload.js');
const moment = use('moment');

class UserHook {
    /**
     * omit fields from update request
     */
    static exceptUpdateField() {
        return [
            'id', 'user_group_id', 'user_type', 'email', 'username', 'slug', 'is_mobile_verify',
            'mobile_verify_at', 'is_email_verify', 'email_verify_at', 'status', 'mobile_otp', 'email_otp',
            'created_at', 'updated_at', 'deleted_at'
        ];
    }

    static async indexQueryHook(query, request, slug = {}) {
        if (request.method() == 'GET') {
            
            let params = request.all()
            let user = request.user();
            if (_.isObject(slug)) {
                query.where('id', '<>', request.user().id);
            }

            if (!_.isEmpty(params.is_panic)) {
                query.where('is_panic', params.is_panic);
            }

            if (user.user_type == 'user') {
                query.where('user_type', 'user')
            }

            if (params.app_users == '1') {
                // get contact records
                let contacts = await Contact.getContacts({ user_id: user.id })               

                let id = contacts.map(contact => contact.user_id_2)

                query.whereNotIn('id', id).orderBy('name', 'ASC')
            }

            if (!_.isEmpty(params.latitude) && !_.isEmpty(params.longitude)) {
                // get nearby records
                // let users = await User.getNearBy(params.latitude, params.longitude)

                // // creating property id array
                // let user_id = users.map(user => user.id)

                // query.whereIn("id", user_id);
            }
            
            if(_.isEmpty(params.app_users)) {
                query.orderBy('created_at', 'DESC');
            }
        }

        query.with('panic')
    }

    static async beforeCreateHook(request, params) {
        let username = await User.generateSlug(strSlug(params.name));
        params.user_group_id = 3;
        params.user_type = 'user';
        params.password = await Hash.make(params.password)
        params.username = username
        params.slug = username
        params.trial_expiration_date = moment().add(Env.get('TRIAL_PERIOD_DAYS'), 'days').format('YYYY-MM-DD HH:mm:ss');

        params.created_at = new Date();
        if (Env.get('OTP_VERIFICATION') == 1 && Env.get('OPT_SENDBOX') == 0 && Env.get('SMS_GATEWAY') == 'Telesign')
            params.mobile_otp = request.mobileOtp() + '|' + new Date()
    }

    static async afterCreateHook(record, request, params) {
        let request_params = request.all();
        let api_token = await User.generateApiToken(params.email, request.header('token'));
        await Database.table('user_api_tokens').insert({
            user_id: record.id,
            api_token: api_token,
            device_type: request_params.device_type,
            device_token: request_params.device_token,
            platform_type: _.isEmpty(request_params.platform_type) ? 'custom' : request_params.platform_type,
            platform_id: _.isEmpty(request_params.platform_id) ? null : request_params.platform_id,
            ip_address: request.ip(),
            user_agent: request.header('User-Agent'),
            created_at: new Date()
        })

        //send verification email
        // if (Env.get('EMAIL_VERIFICATION') == 1) {
        //     let email = Encryption.encrypt(record.email);
        //     email = email.replace('/', '|');
        //     let mail_params = {
        //         name: record.name,
        //         link: baseUrl() + 'user/verify-email/' + encodeURIComponent(email),
        //         app_name: Env.get('APP_NAME')
        //     }
        //     sendMail('emails.register', record.email, 'Welcome to ' + Env.get('APP_NAME'), mail_params).then()
        // }
        //merge api token in adonis request
        Request.macro('apiToken', function () {
            return api_token;
        })
    }

    static async beforeEditHook(request, params, slug) {
        let exceptUpdateField = this.exceptUpdateField();
        exceptUpdateField.filter(exceptField => {
            delete params[exceptField];
        });

        if (!_.isEmpty(request.file('image_url'))) {
            params.image_url = await FileUpload.doUpload(request.file('image_url'), 'user/')
            // params.blur_image = await FileUpload.blurHash(params.image_url)
        }

        if(!_.isEmpty(params.radius_mi)) {
            params.radius_mi = Math.round(params.radius_mi * 1)
        }
    }

    static async afterEditHook(record, request, params) {

    }

    static async beforeDeleteHook(request, params, slug) {

    }

    static async afterDeleteHook(request, params, slug) {

    }
}
module.exports = UserHook;
