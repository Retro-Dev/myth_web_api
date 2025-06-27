'use strict'

const Post = use('App/Models/Post');
const Media = use('App/Models/Media');
const _ = use('lodash');

class SubscriptionHook {
    /**
     * omit fields from update request
     */
    static exceptUpdateField() {
        return [];
    }

    static async indexQueryHook(query, request, slug = {}) {
        let user = request.user()
        if (request.method() == 'GET') {
            query.where('user_id', user.id)
            query.orderBy('created_at', 'desc')
        }
        query.with('user')
    }

    static async beforeCreateHook(request, params) {
        let user = request.user()

        if(params.subscription_id == 'myth_monthly') {
            params.title = 'Monthly'
        } else if(params.subscription_id == 'myth_yearly') {
            params.title = 'Yearly'
        }

        params.user_id = user.id
        params.slug = `subs_${Math.floor((Math.random() * 100) + 1) + new Date().getTime()}`;
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
module.exports = SubscriptionHook;
