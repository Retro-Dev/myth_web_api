'use strict'

const uniqid = use('uniqid');
const _ = use('lodash');

class CategoryHook {

    static async indexQueryHook(query, request, slug = {}) {

    }

    static async beforeCreateHook(request, params) {        
        params.slug = `cat_${Math.floor((Math.random() * 100) + 1) + new Date().getTime()}`
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
                    // .orWhere('categories.answer', 'like', `${keyword}%`)
            })
        }
    }
}
module.exports = CategoryHook
