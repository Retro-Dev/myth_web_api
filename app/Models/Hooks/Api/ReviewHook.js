'use strict'
const _ = use('lodash')

class ReviewHook {
    /**
     * omit fields from update request
     */
    static exceptUpdateField() {
        return [
        ];
    }

    static async indexQueryHook(query, request, slug = {}) {
        if (request.method() == 'GET') {
            let req_params = request.all()
                query.orderBy('created_at', 'DESC');

            if (!_.isEmpty(req_params.directory_id)) {
                query.where('directory_id', req_params.directory_id)
            }
        }
        query
            .with('directory', function (builder) {
                builder
                // .with('reviews', function (builder) {
                //     builder.with('user').orderBy('created_at', 'desc')
                // })
                .with('directoryCategories')
            })
            .with('user')
    }

    static async beforeCreateHook(request, params) {
        let user = request.user()
        params.user_id = user.id
        params.rate = Number(Number(params.rate).toFixed(1))
        params.slug = `review_${Math.floor((Math.random() * 100) + 1) + new Date().getTime()}`
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
module.exports = ReviewHook;
