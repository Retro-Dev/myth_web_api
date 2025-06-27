'use strict'

const uniqid = use('uniqid');
const _ = use('lodash');

class FaqHook
{

    static async indexQueryHook(query, request, slug = {})
    {

    }

    static async beforeCreateHook(request, params)
    {
        params.slug = uniqid();
        params.created_at = new Date();
    }

    static async afterCreateHook(record, request, params)
    {

    }

    static async beforeEditHook(request, params, slug)
    {
        params.updated_at = new Date();
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
        let urlParams = new URLSearchParams(request.input('keyword'));
        if( !_.isEmpty(urlParams.get('keyword')) ){
            let keyword = urlParams.get('keyword');
            query.where( function(){
                this.where('faqs.question','like',`${keyword}%`)
                    .orWhere('faqs.answer','like',`${keyword}%`)
            })
        }
    }
}
module.exports = FaqHook
