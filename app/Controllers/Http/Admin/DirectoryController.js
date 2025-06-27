'use strict'
const { validateAll, rule } = use("Validator");
const { CostExplorer } = require("aws-sdk");
const Controller = require("../Controller");
const _ = use('lodash');
const Antl = use('Antl');
const Directory = use('App/Models/Directory');
const Post = use('App/Models/Post');
const { fileValidation } = use('App/Helpers/Index.js');
const moment = use('moment');
const { baseUrl } = use('App/Helpers/Index.js');
const FileUpload = use('App/Libraries/FileUpload/FileUpload.js');
const csvtojson = use('csvtojson');
const { sendPushNotification } = use("App/Helpers/Index.js");
const User = use("App/Models/User");
const { storageUrl } = use("App/Helpers/Index.js");
const util = require('util')
const uniqid = use('uniqid');

class DirectoryController extends Controller {
    async index({ view }) {
        return view.render('admin.directory.index')
    }

    async ajaxListing({ request, response }) {
        let params = request.all();
        let records = {};
        let record_data = [];
        records.data = [];

        let dataTableRecord = await Directory.dataTableRecords(request);

        records.draw = parseInt(params['draw']);
        records.recordsTotal = !dataTableRecord['total_record'] ? 0 : dataTableRecord['total_record'];
        records.recordsFiltered = !dataTableRecord['total_record'] ? 0 : dataTableRecord['total_record'];
        // set data grid output
        if (dataTableRecord['records'].length > 0) {
            for (var i = 0; i < dataTableRecord['records'].length; i++) {
                record_data.push([
                    dataTableRecord['records'][i].name,
                    dataTableRecord['records'][i].directoryCategories.name,
                    dataTableRecord['records'][i].department,
                    dataTableRecord['records'][i].badge_no,
                    dataTableRecord['records'][i].status == '1' ? `<span class="label label-success">Active</span>` : `<span class="label label-danger">Disabled</span>`,
                    // moment(dataTableRecord['records'][i].created_at).format('MM-DD-YYYY hh:mm A'),
                    `<a href="${baseUrl('/admin/directory/edit/' + dataTableRecord['records'][i].slug)}" class="btn btn-sm btn-info"><i class="fa fa-edit"></i></a>`
                ])
            }
            records.data = record_data
        }
        return response.json(records);
    }

    async create({ view }) {
        return view.render('admin.directory.add')
    }

    async import({ view }) {
        return view.render('admin.directory.import')
    }

    // Function to check if the CSV contains required columns
    validateCSVColumns(csvData, requiredColumns) {
        // Check if all required columns are present
        const missingColumns = requiredColumns.filter(column => !csvData[0].hasOwnProperty(column));

        return missingColumns
    }

    async store({ request, response, session }) {
        if (_.isEmpty(request.file('csv'))) {
            let rules = {
                // name: 'required|min:2|max:10000',
            }
            let validator = await validateAll(request.all(), rules);

            if (validator.fails()) {
                let errorMessages = await this.webValidateRequestParams(validator)
                session.withErrors({ errors: errorMessages }).flashAll()
                return response.redirect('back')
            }

            let fileValidate = fileValidation(request.file('image_url'), 3000000, ['mp4', 'mov', 'quicktime', 'png', 'jpg', 'jpeg']);
            if (fileValidate.error) {
                session.withErrors({ error: 'Image validation failed' }).flashAll()
                return response.redirect('back')
            }

            let directory = await Directory.createRecord(request, request.only(Directory.getFields()))

            // send push 
            let actor = request.user()
            let target = await User.getUserWToken({ user_type: 'user' })
            let reference_id = directory.id
            let reference_module = 'directory_added'
            let reference_slug = directory.slug
            let identifier = 'directory_added'
            let title = 'Myth'
            let message = `Admin has added new directory`
            let module = "directories"
            let record = directory
            let data = {}
            let in_app = true

            // send push
            for (let index = 0; index < target.length; index++) {
                let is_push = target[index].is_notification
                await sendPushNotification(module, title, message, record, reference_id, reference_module, reference_slug, identifier, actor, [target[index]], data, in_app, is_push)
            }
        } else { // for csv upload
            // CSV file name
            const fileName = request.file('csv').tmpPath;

            // Async / await usage
            const jsonArray = await csvtojson({ includeColumns: /(name|department|badge_no|image_url)/ }).fromFile(fileName);

            const requiredColumns = ['name', 'department', 'badge_no', 'image_url']
            let missingColumns = this.validateCSVColumns(jsonArray, requiredColumns)
            if (missingColumns.length == 0) { // all success
                for (let index = 0; index < jsonArray.length; index++) {
                    jsonArray[index].directory_category_id = request.all().directory_category_id
                    jsonArray[index].slug = uniqid();
                    jsonArray[index].created_at = new Date()
                }

                // bulk insert
                await Directory.insertDirectory(jsonArray)

                session.flash({ success: Antl.formatMessage('messages.success_store_message') });

                // send push 
                let actor = request.user()
                let target = await User.getUserWToken({ user_type: 'user' })
                let reference_id = ''
                let reference_module = 'directory_csv_added'
                let reference_slug = ''
                let identifier = 'directory_csv_added'
                let title = 'Myth'
                let message = `Admin has added directories`
                let module = 'directories'
                let record = ''
                let data = {}
                let in_app = true

                // send push
                // for (let index = 0; index < target.length; index++) {
                //     let is_push = target[index].is_notification
                //     await sendPushNotification(module, title, message, record, reference_id, reference_module, reference_slug, identifier, actor, [target[index]], data, in_app, is_push)
                // }
            } else {
                session.withErrors({ error: `Columns are missing [ ${missingColumns} ] ` }).flashAll()
            }
        }

        response.route('admin.directory');
        return;
    }

    async edit({ request, response, session, view, params }) {
        if (request.method() == 'POST') {
            return this._update(request, response, params, session);
        }
        let directory = await Directory.getRecordBySlug(request, params.slug);

        if (_.isEmpty(directory)) {
            session.withErrors({ error: Antl.formatMessage('messages.invalid_request') }).flashAll()
            response.route('admin.directory');
            return;
        }

        return view.render('admin.directory.edit', { directory: directory });
    }

    async _update(request, response, params, session) {
        let body_params = request.all();
        let rules = {
            // status: 'required|in:1,0',
        }
        let validator = await validateAll(request.all(), rules);
        if (validator.fails()) {
            let errorMessages = await this.webValidateRequestParams(validator)
            session.withErrors({ errors: errorMessages }).flashAll()
            return response.redirect('back')
        }
        if (!_.isEmpty(request.file('image_url'))) {

            let fileValidate = fileValidation(request.file('image_url'), 3000000, ['mp4', 'mov', 'quicktime', 'png', 'jpg', 'jpeg']);
            if (fileValidate.error) {
                session.withErrors({ error: 'Image validation failed' }).flashAll()
                return response.redirect('back')
            }

            body_params.image_url = await FileUpload.doUpload(request.file('image_url'), 'directory/')

        }

        delete body_params._csrf;

        // Update directory
        await Directory.updateDirectory({ slug: params.slug }, body_params);

        session.flash({ success: Antl.formatMessage('messages.success_update_message') });
        response.route('admin.directory');
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
module.exports = DirectoryController
