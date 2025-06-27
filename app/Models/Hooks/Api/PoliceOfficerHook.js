'use strict'
const _ = use('lodash');
const PoliceOfficer = use('App/Models/PoliceOfficer');
const FileUpload = use('App/Libraries/FileUpload/FileUpload.js');
const { strSlug } = use("App/Helpers/Index.js");

class PoliceOfficerHook {

    static async indexQueryHook(query, request, slug = {}) {
        let params = request.all()
        if (request.method() == 'GET') {
            query.where('status', '1')
            query.orderBy('created_at', 'DESC');
        }
        query.with('user')
        // query with total reviews
        query.with('officerReviews')
    }

    static async beforeCreateHook(request, params) {
        params.user_id = request.user().id
        params.slug = await PoliceOfficer.generateSlug(strSlug(params.name))
        // image
        if (request.file('image_url')) {
            let image = request.file('image_url')
            params.image_url = await FileUpload.doUpload(image, 'police_officer/')
        }
    }

    static async afterCreateHook(record, request, params) {

    }

    static async beforeEditHook(request, params, slug) {
        // image
        if (request.file('image_url')) {
            let image = request.file('image_url')
            params.image_url = await FileUpload.doUpload(image, 'police_officer/')
        }
    }

    static async afterEditHook(record, request, params) {

    }

    static async beforeDeleteHook(request, params, slug) {

    }

    static async afterDeleteHook(request, params, slug) {

    }

    static async datatable_query_hook(query, request) {
        let urlParams = new URLSearchParams(request.input('keyword'));
        if (!_.isEmpty(urlParams.get('keyword'))) {
            let keyword = urlParams.get('keyword');
            query.where(function () {
                this.where('name', 'like', `${keyword}%`)
                    .orWhere('email', 'like', `${keyword}%`)
                    .orWhere('mobile_no', 'like', `${keyword}%`)
            })
        }

        query.orderBy('created_at', 'desc')
            .with('post')


        // if( !_.isEmpty(urlParams.get('user_type')) ){
        //     query.where('user_type',urlParams.get('user_type'))
        // }
    }
}
module.exports = PoliceOfficerHook
