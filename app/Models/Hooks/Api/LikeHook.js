'use strict'

const _          = use('lodash');

class LikeHook {
    /**
     * omit fields from update request
     */
    static exceptUpdateField() {
        return [
            'id', 'slug', 'created_at', 'updated_at', 'deleted_at', 'user_id'
        ];
    }

    static async indexQueryHook(query, request, slug = {}) {
        
        if (request.method() == 'GET') {
            let params = request.all();

            if( _.isObject(slug) ){
                //   query.where('id','<>',request.user().id);
                  query.where('is_like','1');
                  query.orderBy('created_at','desc');
                }

            if(!_.isEmpty(params.post_id)){
                query.where('post_id', params.post_id)
            }
        }

        query.with('user')
        query.with('post')

    }

    static async beforeCreateHook(request, params) {
        let user = request.user()
        params.is_like = params.is_like
        params.post_id = params.post_id
        params.user_id = user.id
        params.slug = 'like_' + Math.floor((Math.random() * 100) + 1) + new Date().getTime();
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
}
module.exports = LikeHook;
