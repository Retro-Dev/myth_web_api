'use strict'

const Panic       = use('App/Models/Panic');
const Media = use('App/Models/Media');
const User = use('App/Models/User');
const _          = use('lodash');

class WitnessHook
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
            if( _.isObject(slug) ){
              query.where('id','<>',request.user().id);
              query.orderBy('created_at','DESC');
            }
        }

        query.with('user')
        query.with('panic', function (builder) {
            builder.with('user').with('media', function (media_builder) {
                media_builder.where('is_admin', 1)
            }).with('witness')
        })
    }

    static async beforeCreateHook(request, params)
    {
      let user = request.user()

      params.user_id = user.id
      params.panic_id = params.panic_id
      params.agora_token = params.agora_token,
      params.slug = `witness_${Math.floor((Math.random() * 100) + 1) + new Date().getTime()}`;
    }

    static async afterCreateHook(record, request, params)
    {
        // let user = request.user()

        // // get one record order by date in ascending
        // let witness = await Database.table('witnesses').where('user_id', user.id).where('panic_id', params.panic_id).orderBy('created_at', 'asc').first()
        
        // // delete records except witness.id
        // await Database.table('witnesses').where('id', '<>', witness.id).where('panic_id',params.panic_id).where('user_id', user.id).delete()
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
module.exports = WitnessHook;
