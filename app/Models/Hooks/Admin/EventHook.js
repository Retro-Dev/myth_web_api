'use strict'

const uniqid = use('uniqid');
const _ = use('lodash');
const { fileValidation } = use('App/Helpers/Index.js');
const FileUpload = use('App/Libraries/FileUpload/FileUpload.js');
const { strSlug, generateVideoThumb } = use("App/Helpers/Index.js");
const Antl = use("Antl");

class EventHook {

    static async indexQueryHook(query, request, slug = {}) {

    }

    static async beforeCreateHook(request, params) {        
        
        params.file_url = await FileUpload.doUpload(request.file('file_url'), 'event/'),
        params.file_type = request.file('file_url').type

        params.slug = uniqid();
        let [date, time] = request.all().date_time.split('T');
        params.date = date
        params.time = time

        // params.created_at = new Date();
    }

    static async afterCreateHook(record, request, params) {

    }

    static async beforeEditHook(request, params, slug) {
        if (!_.isEmpty(request.file('file_url'))) {
            params.file_url = await FileUpload.doUpload(request.file('file_url'), 'event/')
            params.file_type = request.file('file_url').type
        }
        params.updated_at = new Date();
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
                this.where('title', 'like', `${keyword}%`)
                    // .orWhere('events.answer', 'like', `${keyword}%`)
            })
        }
    }
}
module.exports = EventHook
