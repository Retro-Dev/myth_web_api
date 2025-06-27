'use strict'

const FileUpload = use('App/Libraries/FileUpload/FileUpload.js');
const { strSlug, generateVideoThumb, videoDuration } = use("App/Helpers/Index.js");
const _ = use("lodash");

class MediaHook {
  /**
   * omit fields from update request
   */
  static exceptUpdateField() {
    return [];
  }



  static async indexQueryHook(query, request, slug = {}) {
    if (request.method() == 'GET') {
      let params = request.all();
      let user = request.user();

      if (_.isObject(slug)) {
        //   query.where('id','<>',request.user().id);
        query.where('user_id', user.id);
      }

      if (params.module_id) {
        query.where('module_id', params.module_id)
      }
      if (params.module) {
        query.where('module', params.module)
      }
      if (params.user_id) {
        query.where('user_id', params.user_id)
      }
    }
    query.with('user')
  }

  static async beforeCreateHook(request, params) {
    let user = request.user()
    let req_params = request.all()
    let file = request.file('media_url')
    
    // let thumbnail
    params.user_id = user.id;
    params.slug = `media_${Math.floor((Math.random() * 100) + 1) + new Date().getTime()}`;
    params.filename = file.stream.filename,
    params.module = 'gallery',
      params.is_admin = req_params.is_admin
    if (file.type == 'video') {
      let thumbnail = await generateVideoThumb(file.tmpPath, 'uploads/video-screenshot');
      let duration_ms = await videoDuration(file.tmpPath);
      params.thumbnail_url = thumbnail;
      params.duration_ms = duration_ms;
    }
      params.original_name = file.stream.filename,
      params.file_url = await FileUpload.doUpload(request.file('media_url'), 'media/'),
      params.file_type = file.type,
      params.file_url_blur = '',
      params.created_at = new Date()
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
module.exports = MediaHook;
