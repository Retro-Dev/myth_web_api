'use strict'

const Panic = use('App/Models/Panic');
const Media = use('App/Models/Media');
const User = use('App/Models/User');
const Witness = use('App/Models/Witness');
const Hash = use('Hash');
const Encryption = use('Encryption');
const _ = use('lodash');
const Env = use('Env');
const Database = use('Database')
const Request = use('Adonis/Src/Request')
const { strSlug, sendMail, baseUrl } = use("App/Helpers/Index.js");
const FileUpload = use('App/Libraries/FileUpload/FileUpload.js');

class PanicHook {
    /**
     * omit fields from update request
     */
    static exceptUpdateField() {
        return [];
    }

    static async indexQueryHook(query, request, slug = {}) {
        let user = request.user();
        let params = request.all();
        if (request.method() == 'GET') {
            if (_.isObject(slug)) { // slug = { contains params ... }
                //   query.where('id','<>',request.user().id);
                query.orderBy('created_at', 'DESC');
            }

            if (params.is_mypanic === '1') {
                query.where('user_id', user.id)
            }

            if (params.is_mypanic === '0') {
                let witnesses = await Witness.getWitnesses({ 'user_id': user.id })

                let panic_id = witnesses.map(witness => witness.panic_id)

                query.whereIn('id', panic_id).whereDoesntHave('otherPanics', function (builder) {
                    builder.where('user_id', user.id)
                }
                )
            }
        }
        query.whereHas('user', function (builder) {
            builder.where('status', '1')
        }).with('user')
        query.with('media', function (builder) {
            builder.where('module', 'panic').where('user_id', user.id)
        })

        query.with('witness', function (builder) {
            builder.with('user')
        })
    }

    static async beforeCreateHook(request, params) {
        let user = request.user()

        params.user_id = user.id
        params.latitude = user.latitude
        params.longitude = user.longitude
        params.slug = `${Math.floor((Math.random() * 100) + 1) + new Date().getTime()}`;
    }

    static async afterCreateHook(record, request, params) {

    }

    static async beforeEditHook(request, params, slug) {

    }

    static async afterEditHook(record, request, params) {
        let req_params = request.all()

        let user = request.user()

        let slug = request.params.id

        let panic = await Panic.getRecordBySlug(request, slug);

        if (req_params.media_id) {
            let condition = {
                id: req_params.media_id
            }

            // get media
            let media = await Media.getMedia(condition)

            // create array of nested objects
            for (let index = 0; index < media.length; index++) {
                delete media[index]['updated_at']
                delete media[index]['deleted_at']
                delete media[index]['id']

                media[index]['slug'] = `media_${Math.floor((Math.random() * 100) + 1) + new Date().getTime()}`
                media[index]['module'] = 'panic'
                media[index]['module_id'] = panic.id
                media[index]['created_at'] = new Date()
            }

            // bulk insert media
            await Media.insertMedia(media)

            // get witness
            let witness = await Witness.getWitness({ panic_id: panic.id, user_id: user.id });

            // if witness empty, create witness record
            if (_.isEmpty(witness)) {
                // witness record
                let witness_record = {
                    user_id: user.id,
                    panic_id: panic.id,
                    slug: `witness_${Math.floor((Math.random() * 100) + 1) + new Date().getTime()}`,
                    agora_token: panic.agora_token
                }
                
                await Witness.createWitness(witness_record)
            }
        }

        if (req_params.delete_media_id) {
            let condition = {
                media_id: req_params.delete_media_id
            }

            let data = {
                deleted_at: new Date()
            }
            await Media.updateMedia(condition, data)
        }

        // update is_panic in user record
        await User.updateUser({ slug: user.slug }, { is_panic: '0' })
    }

    static async beforeDeleteHook(request, params, slug) {

    }

    static async afterDeleteHook(request, params, slug) {

    }
}
module.exports = PanicHook;
