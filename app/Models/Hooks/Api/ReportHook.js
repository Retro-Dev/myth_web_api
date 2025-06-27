'use strict'
const _          = use('lodash');

class ReportHook
{

    static async indexQueryHook(query, request, slug = {})
    {
        query.with('post', function(builder){
            builder.with('media').with('user')
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

        query.orderBy('created_at', 'desc')
                .with('post')
        
        
        // if( !_.isEmpty(urlParams.get('user_type')) ){
        //     query.where('user_type',urlParams.get('user_type'))
        // }
    }
}
module.exports = ReportHook
