'use strict'
const _ = use('lodash')

class OfficerReviewHook {
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

            if (!_.isEmpty(req_params.officer_id)) {
                query.where('officer_id', req_params.officer_id)
            }
        }
        query
            .with('user')
            .with('policeOfficer', function (builder) {
                builder.with('user')
            })
            // .with('directory', function (builder) {
            //     builder
            //     // .with('reviews', function (builder) {
            //     //     builder.with('user').orderBy('created_at', 'desc')
            //     // })
            //     .with('directoryCategories')
            // })
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
module.exports = OfficerReviewHook;
