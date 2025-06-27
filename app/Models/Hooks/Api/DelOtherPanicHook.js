'use strict'

class DelOtherPanicHook {
    /**
     * omit fields from update request
     */
    static exceptUpdateField() {
        return [];
    }

    static async indexQueryHook(query, request, slug = {}) {

    }

    static async beforeCreateHook(request, params) {
        let user = request.user()
        params.user_id = user.id
        params.panic_id = params.panic_id
        params.slug = `slug_${user.id}_${params.panic_id}_${Math.floor((Math.random() * 100) + 1) + new Date().getTime()}`
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
module.exports = DelOtherPanicHook;
