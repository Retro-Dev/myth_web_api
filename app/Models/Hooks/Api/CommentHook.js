'use strict'

const Comment = use('App/Models/Comment');
const Post = use('App/Models/Post');
const _          = use('lodash');

class PostHook {
    /**
     * omit fields from update request
     */
    static exceptUpdateField() {
        return [
            'id', 'slug', 'post_id', 'created_at', 'updated_at', 'deleted_at'
        ];
    }

    static async indexQueryHook(query, request, slug = {}) {
        if (request.method() == 'GET') {
            let params = request.all();

            if(!_.isEmpty(params.post_id)){
                query.where('post_id', params.post_id)
            }
        }

        query.with('user')
        query.with('post', function (pst) {
            pst.with('media').with('comment', function (builder) {
                builder.with('user')
            }).with('user').with('like', function (lk) {
                lk.with('user')
            }).orderBy('created_at', 'asc')
        })
    }

    static async beforeCreateHook(request, params) {
        let user = request.user()
        params.user_id = user.id
        params.post_id = params.post_id
        params.comment = params.comment
        params.slug = 'cmnt_' + Math.floor((Math.random() * 100) + 1) + new Date().getTime();
    }

    static async afterCreateHook(record, request, params) {
        // get like counts
        let count = await Comment.getCommentsCount({ post_id: params.post_id })

        // updating post record total likes
        await Post.updateTotalLikes({ id: params.post_id }, { total_comments: count })
    }

    static async beforeEditHook(request, params, slug) {
        if (params.comment) {
            params.comment = params.comment
        }
    }

    static async afterEditHook(record, request, params) {

    }

    static async beforeDeleteHook(request, params, slug) {
        let comment = await Comment.getCommentRecord({slug: slug})
        
        params.post_id = comment.post_id
    }

    static async afterDeleteHook(request, params, slug) {       
        // get comment counts against post
        let count = await Comment.getCommentsCount({ post_id: params.post_id })

        // updating post record total comments
        await Post.updatePost({ id: params.post_id }, { total_comments: count })
    }
}
module.exports = PostHook;
