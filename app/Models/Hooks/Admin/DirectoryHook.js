'use strict'

const uniqid = use('uniqid');
const _ = use('lodash');
const { fileValidation } = use('App/Helpers/Index.js');
const FileUpload = use('App/Libraries/FileUpload/FileUpload.js');
const Antl = use("Antl");

class DirectoryHook {

    static async indexQueryHook(query, request, slug = {}) {
        query.with('directoryCategories')
    }

    static async beforeCreateHook(request, params) {   

        params.image_url = await FileUpload.doUpload(request.file('image_url'), 'directory/')
        
        // params.file_type = request.file('image_url').type
        params.slug = uniqid();

        // params.created_at = new Date();
    }

    static async afterCreateHook(record, request, params) {
        
    }

    static async beforeEditHook(request, params, slug) {
        if (!_.isEmpty(request.file('image_url'))) {
            params.image_url = await FileUpload.doUpload(request.file('image_url'), 'directory/')
            // params.file_type = request.file('image_url').type
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
                this.where('name', 'like', `${keyword}%`)
                    // .orWhere('directories.answer', 'like', `${keyword}%`)
            })
        }

        query.with('directoryCategories')
    }
}
module.exports = DirectoryHook
