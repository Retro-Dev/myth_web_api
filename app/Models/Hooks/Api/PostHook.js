'use strict'

const Post       = use('App/Models/Post');
const Media = use('App/Models/Media');
const _          = use('lodash');

class PostHook
{
    /**
     * omit fields from update request
     */
    static exceptUpdateField()
    {
        return [];
    }

    static async indexQueryHook(query, request, slug = {})
    {
        let user = request.user()
        if( request.method() == 'GET' )
        {
            if( _.isObject(slug) ){
            //   query.where('id','<>',request.user().id);
            query.where('status', '1')
              query.orderBy('created_at','DESC');
            }
        }
        query.where('status', '1')
        query.with('like', function (builder) {
            builder.with('user')
        })
        query.whereHas('user',function (builder) {
            builder.where('status', '1')
        })
        query.with('user')
        query.with('post')
        query.with('media', function (builder) {
            builder.where('module','post')
        })
        query.with('is_like', function(builder){
            builder.where('is_like','1').where('user_id', user.id)
        })
    }

    static async beforeCreateHook(request, params)
    {
      let user = request.user()

      params.user_id = user.id
      params.slug = `post_${Math.floor((Math.random() * 100) + 1) + new Date().getTime()}`;
    }

    static async afterCreateHook(record, request, params)
    {
        let req_params = request.all()
        if (req_params.media_id) {
            let condition = {
                media_id: req_params.media_id
            }

            let data = {
                module: 'post',
                module_id: record.id,
            }

            await Media.updateMedia(condition, data)
        }
    }

    static async beforeEditHook(request, params, slug)
    {

    }

    static async afterEditHook(record, request, params)
    {
      let req_params = request.all()

      let slug = request.params.id

      let post = await Post.getRecordBySlug(request, slug);

      if (req_params.media_id) {
          let condition = {
              media_id: req_params.media_id
          }

          let data = {
              module: 'post',
              module_id: post.id,
          }
          await Media.updateMedia(condition, data)
      }

      if (req_params.delete_media_id) {
          let condition = {
              media_id: req_params.delete_media_id
          }

          let data = {
              module: '',
              module_id: 0,
          }
          await Media.updateMedia(condition, data)
      }
    }

    static async beforeDeleteHook(request, params, slug)
    {

    }

    static async afterDeleteHook(request, params, slug)
    {

    }
}
module.exports = PostHook;
