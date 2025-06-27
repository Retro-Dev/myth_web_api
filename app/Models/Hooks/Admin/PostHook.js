'use strict'
const _          = use('lodash');

class PostHook
{

    static async indexQueryHook(query, request, slug = {})
    {
        query.with('user').with('like', function (builder) {
            builder.with('user')
        }).with('comment', function (builder) {
            builder.with('user')
        }).with('media', function (builder) {
            builder.where('module', 'post')
        })
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
        let urlParams = new URLSearchParams(request.input('keyword'));
        if( !_.isEmpty(urlParams.get('keyword')) ){
            let keyword = urlParams.get('keyword');
            query.where( function(){
                this.where('name','like',`${keyword}%`)
                    .orWhere('email','like',`${keyword}%`)
                    .orWhere('mobile_no','like',`${keyword}%`)
            })
        }

        query
        .with('user').with('comment')
        .orderBy('created_at', 'desc')
        
        // if( !_.isEmpty(urlParams.get('user_type')) ){
        //     query.where('user_type',urlParams.get('user_type'))
        // }
    }
}
module.exports = PostHook
