'use strict'
const _          = use('lodash');

class CategoryHook
{

    static async indexQueryHook(query, request, slug = {})
    {
        query.where('status', '1')
    }

    static async beforeCreateHook(request, params)
    {

    }

    static async afterCreateHook(record, request, params)
    {

    }

    static async beforeEditHook(request, params, slug)
    {

    }

    static async afterEditHook(record, request, params)
    {

    }

    static async beforeDeleteHook(request, params, slug)
    {

    }

    static async afterDeleteHook(request, params, slug)
    {

    }

    static async datatable_query_hook(query,request)
    {

    }
}
module.exports = CategoryHook
