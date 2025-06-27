'use strict'
const { validateAll } = use("Validator");
const Controller = require("../Controller");
const ApplicationContent = use('App/Models/ApplicationContent');
const _ = use('lodash')
const Antl = use('Antl');
const moment = use('moment');
const { baseUrl } = use('App/Helpers/Index.js');

class ContentController extends Controller
{
    async index({view})
    {
        return view.render('admin.content.index')
    }

    async ajaxListing({request,response})
    {
        let params = request.all();
        let records  = {};
        let record_data = [];
        records.data = [];
        //get records for datatable
        let dataTableRecord = await ApplicationContent.dataTableRecords(request);
        records.draw = parseInt(params['draw']);
        records.recordsTotal = _.isEmpty(dataTableRecord['total_record']) ? 0 : dataTableRecord['total_record'];
        records.recordsFiltered = _.isEmpty(dataTableRecord['total_record']) ? 0 : dataTableRecord['total_record'];
        // set data grid output
        if( dataTableRecord['records'].length > 0 ) {
            for( var i=0; i < dataTableRecord['records'].length; i++ ){
              let options  = `<a href="${ baseUrl('/admin/content/'+dataTableRecord['records'][i].slug + '/edit') }" title="edit" class="btn btn-sm btn-info"><i class="fa fa-edit"></i></a>`;
              record_data.push([
                  dataTableRecord['records'][i].title,
                  moment(dataTableRecord['records'][i].created_at).format('MM-DD-YYYY hh:mm A'),
                  options
              ])
            }
            records.data = record_data
        }
        return response.json(records);
    }

    async edit({request, response, view, params, session})
    {
        let record = await ApplicationContent.getRecordBySlug(request, params.id);
        if( _.isEmpty(record) ){
           session.withErrors({error: Antl.formatMessage('messages.invalid_request')  }).flashAll()
           response.route('content.index');
        }
        return view.render('admin.content.edit',{ record:record });
    }

    async update({request, response, session})
    {
        let rules = {
            content: 'required|min:2|max:10000',
        }
        let validator = await validateAll(request.all(), rules);

        if (validator.fails()) {
            let errorMessages = await this.webValidateRequestParams(validator)
            session.withErrors({errors: errorMessages }).flashAll()
            return response.redirect('back')
        }
        let params = request.all();
        await ApplicationContent.updateRecord(request,request.only(ApplicationContent.getFields()), params.slug);
        session.flash({success: Antl.formatMessage('messages.success_update_message') });
        response.route('content.index');
    }
}
module.exports = ContentController
