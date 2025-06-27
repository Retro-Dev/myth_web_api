'use strict'
const _ = use('lodash');

class DirectoryHook {

    static async indexQueryHook(query, request, slug = {}) {
        let params = request.all()
        if (request.method() == 'GET') {
            query.where('status', '1')
            query.orderBy('created_at', 'DESC');

            if (!_.isEmpty(params.category_id)) {
                query.whereHas('directoryCategories', function (builder) {
                    builder.where('id', params.category_id).where('status', '1')
                })
            }
        }


        query
            .whereHas('directoryCategories', function (builder) {
                builder.where('status', '1')
            })
            .with('directoryCategories')
            .with('reviews', function (builder) {
                builder.with('user').orderBy('created_at', 'desc')
            })
    }

    static async beforeCreateHook(request, params) {

    }

    static async afterCreateHook(record, request, params) {

    }

    static async beforeEditHook(request, params, slug) {

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
module.exports = DirectoryHook
