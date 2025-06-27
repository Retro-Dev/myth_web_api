'use strict'
const { validateAll, rule } = use("Validator");
const { CostExplorer } = require("aws-sdk");
const Controller = require("../Controller");
const _ = use('lodash');
const Antl = use('Antl');
const Report = use('App/Models/Report');
const Post = use('App/Models/Post');
const Media = use('App/Models/Media');
const moment = use('moment');
const { baseUrl } = use('App/Helpers/Index.js');
const {storageUrl} = use("App/Helpers/Index.js");
const util = require('util')

class ReportController extends Controller {
    async index({ view }) {
        return view.render('admin.newsfeed.report.index')
    }

    async ajaxListing({ request, response }) {
        let params = request.all();
        let records = {};
        let record_data = [];
        records.data = [];

        let dataTableRecord = await Report.dataTableRecords(request);
        
        records.draw = parseInt(params['draw']);
        records.recordsTotal = dataTableRecord['total_record'] == null ? 0 : dataTableRecord['total_record'];
        records.recordsFiltered = dataTableRecord['total_record'] == null ? 0 : dataTableRecord['total_record'];
        // set data grid output
        if (dataTableRecord['records'].length > 0) {
            for (var i = 0; i < dataTableRecord['records'].length; i++) {
                record_data.push([
                    dataTableRecord['records'][i].id,
                    dataTableRecord['records'][i].post.id,
                    dataTableRecord['records'][i].user.email,
                    dataTableRecord['records'][i].post.status == '1' ? `<span class="label label-success">Active</span>` : `<span class="label label-danger">Disabled</span>`,
                    // moment(dataTableRecord['records'][i].created_at).format('MM-DD-YYYY hh:mm A'),
                    `<a href="${baseUrl('/admin/report/edit/' + dataTableRecord['records'][i].slug)}" class="btn btn-sm btn-info"><i class="fa fa-edit"></i></a>`
                ])
            }
            records.data = record_data
        }
        return response.json(records);
    }

    async create({ view }) {
        return view.render('admin.newsfeed.report.add')
    }

    async store({ request, response, session }) {
        let rules = {
            name: 'required|min:2|max:10000',
        }
        let validator = await validateAll(request.all(), rules);

        if (validator.fails()) {
            let errorMessages = await this.webValidateRequestParams(validator)
            session.withErrors({ errors: errorMessages }).flashAll()
            return response.redirect('back')
        }
        request.all().status=true
        let report = await Report.createRecord(request, request.only(Report.getFields()))
        await Media.uploadAdminMedia(request, report._id)

        session.flash({ success: Antl.formatMessage('messages.success_store_message') });
        response.route('report.index');
        return;
    }


    async edit({ request, response, session, view, params }) {
        if( request.method() == 'POST' ){
            return this._update(request,response,params,session);
        }
        let report = await Report.getRecordBySlug(request, params.slug);
                
        // report.post.media[0].file_url = storageUrl(report.post.media[0].file_url)
        
        if( _.isEmpty(report) ){
            session.withErrors({error: Antl.formatMessage('messages.invalid_request') }).flashAll()
            response.route('admin.report');
            return;
        }
        return view.render('admin.newsfeed.report.edit', { report: report });
    }

    async _update(request, response, params, session) {
        let body_params = request.all();
        let rules = {
            status: 'required|in:1,0',
        }
        let validator = await validateAll(request.all(), rules);
        if (validator.fails()) {
            let errorMessages = await this.webValidateRequestParams(validator)
            session.withErrors({errors: errorMessages }).flashAll()
            return response.redirect('back')
        }
        body_params.status = body_params.status == 1 ? '1' : '0';

        delete body_params._csrf;
        // Get report
        let report = await Report.getReport({slug:params.slug});
        
        // Update post
        await Post.updatePost({id:report.post.id},body_params);

        session.flash({success: Antl.formatMessage('messages.success_update_message') });
        response.route('admin.report');
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
module.exports = ReportController
