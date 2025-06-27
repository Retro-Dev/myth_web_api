'use strict'
const { validateAll, rule } = use("Validator");
const { CostExplorer } = require("aws-sdk");
const Controller = require("../Controller");
const _ = use('lodash');
const Antl = use('Antl');
const Panic = use('App/Models/Panic');
const Post = use('App/Models/Post');
const { fileValidation } = use('App/Helpers/Index.js');
const moment = use('moment');
const { baseUrl } = use('App/Helpers/Index.js');
const FileUpload = use('App/Libraries/FileUpload/FileUpload.js');
const { storageUrl } = use("App/Helpers/Index.js");
const util = require('util')
const { sendPushNotification } = use("App/Helpers/Index.js");
const User = use("App/Models/User");
const WitnessStreamViewTime = use("App/Models/WitnessStreamViewTime");

class PanicController extends Controller {
    async index({ view }) {
        return view.render('admin.panic.index')
    }

    async ajaxListing({ request, response }) {
        let params = request.all();
        let records = {};
        let record_data = [];
        records.data = [];

        let dataTableRecord = await Panic.dataTableRecords(request);

        records.draw = parseInt(params['draw']);
        records.recordsTotal = !dataTableRecord['total_record'] ? 0 : dataTableRecord['total_record'];
        records.recordsFiltered = !dataTableRecord['total_record'] ? 0 : dataTableRecord['total_record'];
        // set data grid output
        if (dataTableRecord['records'].length > 0) {
            for (var i = 0; i < dataTableRecord['records'].length; i++) {
                record_data.push([
                    dataTableRecord['records'][i].user.email,
                    `<a href="${baseUrl('/admin/panic/edit/' + dataTableRecord['records'][i].slug)}" class="btn btn-sm btn-info"><i class="fa fa-eye"></i></a>`
                ])
            }
            records.data = record_data
        }
        return response.json(records);
    }

    async create({ view }) {
        return view.render('admin.panic.add')
    }

    async store({ request, response, session }) {
        let rules = {
            // title: 'min:2|max:30',
        }
        let validator = await validateAll(request.all(), rules);

        if (validator.fails()) {
            let errorMessages = await this.webValidateRequestParams(validator)
            session.withErrors({ errors: errorMessages }).flashAll()
            return response.redirect('back')
        }

        let fileValidate = fileValidation(request.file('file_url'), 3000000, ['mp4', 'mov', 'quicktime', 'png', 'jpg', 'jpeg']);
        if (fileValidate.error) {
            session.withErrors({ error: 'Image validation failed' }).flashAll()
            return response.redirect('back')
        }

        let event = await Event.createRecord(request, request.only(Event.getFields()))

        // send push 
        let actor = request.user()
        let target = await User.getUserWToken({ user_type: 'user' })
        let reference_id = event.id
        let reference_module = 'event_added'
        let reference_slug = event.slug
        let identifier = 'event_added'
        let title = 'Myth'
        let message = `Admin has added new event`
        let module = "events"
        let record = event
        let data = {}
        let in_app = true

        // send push
        for (let index = 0; index < target.length; index++) {
            let is_push = target[index].is_notification
            await sendPushNotification(module, title, message, record, reference_id, reference_module, reference_slug, identifier, actor, [target[index]], data, in_app, is_push)
        }

        session.flash({ success: Antl.formatMessage('messages.success_store_message') });
        response.route('admin.event');
        return;
    }


    async edit({ request, response, session, view, params }) {
        if (request.method() == 'POST') {
            return this._update(request, response, params, session);
        }

        let record = await Panic.getRecordBySlug(request, params.slug);

        record.witness.forEach((witness, index) => {
            const witness_watch_duration_minutes = witness.witnessLogs.reduce((sum, log) => sum + log.watch_duration_minutes, 0);
            record.witness[index].watch_time = Math.ceil(witness_watch_duration_minutes)
        });

        record.witness_count = record.witness.length
        record.panic_duration_minutes = Math.ceil(_.round(moment.duration(record.panic_duration_ms).asMinutes(),2))

        record.start_panic_time = moment(record.start_panic_time_ms).format('h:mm a')
        record.end_panic_time = moment(record.end_panic_time_ms).format('h:mm a')

        let watch_time = await WitnessStreamViewTime.sumWitnessStreamViewTime({ panic_id: record.id })
        
        record.watch_time = Math.ceil(_.round(watch_time, 2))

        if(_.isEmpty(record.user.image_url)){
            record.user.image_url = baseUrl('/images/user-placeholder.jpg')
        }

        if (_.isEmpty(record)) {
            session.withErrors({ error: Antl.formatMessage('messages.invalid_request') }).flashAll()
            response.route('admin.panic');
            return;
        }
        
        return view.render('admin.panic.edit', { record: record });
    }

    async _update(request, response, params, session) {
        let body_params = request.all();
        let rules = {
            // title: 'min:2|max:30',
        }
        let validator = await validateAll(request.all(), rules);
        if (validator.fails()) {
            let errorMessages = await this.webValidateRequestParams(validator)
            session.withErrors({ errors: errorMessages }).flashAll()
            return response.redirect('back')
        }
        if (!_.isEmpty(request.file('file_url'))) {

            let fileValidate = fileValidation(request.file('file_url'), 3000000, ['mp4', 'mov', 'quicktime', 'png', 'jpg', 'jpeg']);
            if (fileValidate.error) {
                session.withErrors({ error: 'Image validation failed' }).flashAll()
                return response.redirect('back')
            }

            body_params.file_url = await FileUpload.doUpload(request.file('file_url'), 'event/')

        }

        if (!_.isEmpty(body_params.date_time)) {
            let [date, time] = request.all().date_time.split('T');
            body_params.date = date
            body_params.time = time
        }

        delete body_params._csrf;
        delete body_params.date_time;

        // Update directory
        await Event.updateEvent({ slug: params.slug }, body_params);

        session.flash({ success: Antl.formatMessage('messages.success_update_message') });
        response.route('admin.event');
        return;
    }

    async searchAdminUser({ request, response, auth }) {
        let params = request.all();
        let users = await Event.searchAdminUser(auth.user.email, params.term);
        if (users.length > 0) {
            var data = [];
            for (var i = 0; i < users.length; i++) {
                let image_url = _.isEmpty(users[i].image_url) ? baseUrl('/images/avtar-2.png') : baseUrl('/' + users[i].image_url);
                data.push({
                    value: users[i]._id,
                    label: `<img src="${image_url}" width="70" />&nbsp;&nbsp;&nbsp; ${users[i].name}`
                })
            }
        } else {
            var data = {};
            data.value = '';
            data.label = 'No Record Found';
        }
        response.json(data);
        return;
    }
}
module.exports = PanicController
