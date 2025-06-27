'use strict'

const Panic       = use('App/Models/Panic');
const Media = use('App/Models/Media');
const User = use('App/Models/User');
const _          = use('lodash');

class ContactHook
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
        if( request.method() == 'GET' )
        {
            let params = request.all()

            let user = request.user();
            
            if( _.isObject(slug) ){
            //   query.where('id','<>',request.user().id);
              query.where('user_id', user.id);
              query.orderBy('user_id_2','ASC');
            }
            
            if(!_.isEmpty(params.keyword)) {
                query.whereHas('user_2', function (builder) {
                    builder.where('name', 'like',`%${params.keyword}%`)
                })
            }
        }

        query.with('user')
        query.with('user_2')
    }

    static async beforeCreateHook(request, params)
    {
      let user = request.user()
      let req_params = request.all()
        
      params.user_id = user.id
      params.user_id_2 = req_params.user_id
      params.slug = `cntct_${Math.floor((Math.random() * 100) + 1) + new Date().getTime()}`;
    }

    static async afterCreateHook(record, request, params)
    {

    }

    static async beforeEditHook(request, params, slug)
    {

    }

    static async afterEditHook(record, request, params)
    {
      let req_params = request.all()

      let user = request.user()

      let slug = request.params.id

      let panic = await Panic.getRecordBySlug(request, slug);

      if (req_params.media_id) {
          let condition = {
              media_id: req_params.media_id
          }

          let data = {
              module: 'panic',
              module_id: panic.id,
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

      // update is_panic in user record
      await User.updateUser({slug: user.slug}, {is_panic: '0'})
    }

    static async beforeDeleteHook(request, params, slug)
    {

    }

    static async afterDeleteHook(request, params, slug)
    {

    }
}
module.exports = ContactHook;
