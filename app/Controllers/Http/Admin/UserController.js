'use strict'
const { validateAll, rule } = use("Validator");
const Controller = require("../Controller");
const _ = use('lodash');
const Antl = use('Antl');
const User = use('App/Models/User');
const moment = use('moment');
const { baseUrl } = use('App/Helpers/Index.js');

class UserController extends Controller
{
    async index({view})
    {
        return view.render('admin.user.index')
    }

    async ajaxListing({request, response})
    {
        let params = request.all();
        let records  = {};
        let record_data = [];
        records.data = [];
        //get records for datatable
        let dataTableRecord = await User.dataTableRecords(request);
        
        records.draw = parseInt(params['draw']);
        records.recordsTotal = dataTableRecord['total_record'] == 0 ? 0 : dataTableRecord['total_record'];
        records.recordsFiltered = dataTableRecord['total_record'] == 0 ? 0 : dataTableRecord['total_record'];
        // set data grid output
        if( dataTableRecord['records'].length > 0 ) {
            for( var i=0; i < dataTableRecord['records'].length; i++ ){
              record_data.push([
                  dataTableRecord['records'][i].name,
                  dataTableRecord['records'][i].email,
                  dataTableRecord['records'][i].mobile_no,
                //   dataTableRecord['records'][i].is_email_verify == true ? `<span class="label label-success">Verified</span>` : `<span class="label label-danger">Not Verified</span>`,
                  dataTableRecord['records'][i].status == true ? `<span class="label label-success">Active</span>` : `<span class="label label-danger">Disabled</span>`,
                //   moment(dataTableRecord['records'][i].created_at).format('MM-DD-YYYY hh:mm A'),
                  `<a href="${ baseUrl('/admin/user/edit/'+dataTableRecord['records'][i].slug) }" class="btn btn-sm btn-info"><i class="fa fa-edit"></i></a>`
              ])
            }
            records.data = record_data
        }
        return response.json(records);
    }

    async edit({request,response,session,view, params})
    {

        if( request.method() == 'POST' ){
            return this._update(request,response,params,session);
        }
        let user = await User.getRecordBySlug(request,params.slug);
        if( _.isEmpty(user) ){
            session.withErrors({error: Antl.formatMessage('messages.invalid_request') }).flashAll()
            response.route('admin.user');
            return;
        }
        return view.render('admin.user.edit',{ user:user });
    }

    async _update(request,response,params,session)
    {
        let body_params = request.all();
        let rules = {
            status: 'required|in:1,0',
            is_email_verify: 'in:1,0',
        }
        let validator = await validateAll(request.all(), rules);
        if (validator.fails()) {
            let errorMessages = await this.webValidateRequestParams(validator)
            session.withErrors({errors: errorMessages }).flashAll()
            return response.redirect('back')
        }
        body_params.status = body_params.status == 1 ? '1' : '0';
        if( !_.isEmpty(body_params.is_email_verify) ){
          body_params.is_email_verify = body_params.is_email_verify == 1 ? '1' : '0';
        }
        delete body_params._csrf;
        await User.updateUser({slug:params.slug},body_params);

        session.flash({success: Antl.formatMessage('messages.success_update_message') });
        response.route('admin.user');
        return;
    }
}
module.exports = UserController
