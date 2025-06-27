'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const CmsModule    = use('App/Models/CmsModule');
const _ = use('lodash');
const Antl = use('Antl');

class CheckModulePermission {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response }, next) {
    // call next to advance the request
    let user = request.user();
    if( user.CmsRole.slug != 'super-admin' ){
      let current_api_url = request.url()
          current_api_url = current_api_url.split('/');
      let module_slug     = current_api_url[3];

      let getCmsModule = await CmsModule.getModuleBySlug(module_slug);
      if( _.isEmpty(getCmsModule) ){
          let data = {
              code: 403,
              message: Antl.formatMessage('messages.permission_denied'),
              data:{}
          }
          response.status(403).send(data);
          return;
      } else {
          getCmsModule  = getCmsModule.toJSON();
          let getAction = this.getAction(request.method());
          let role_permissions = user.CmsRole.module_permission;
          if( _.isEmpty(role_permissions) ){
              let data = {
                  code: 403,
                  message: Antl.formatMessage('messages.permission_denied'),
                  data:{}
              }
              response.status(403).send(data);
              return;
          }
          for( var i=0; i < role_permissions.length; i++ ){
              if( role_permissions[i].module_id == getCmsModule._id ){
                  if( role_permissions[i][getAction] != 1 || role_permissions[i][getAction] != true  ){
                    let data = {
                        code: 403,
                        message: Antl.formatMessage('messages.permission_denied'),
                        data:{}
                    }
                    response.status(403).send(data);
                    return;
                  }
              } else {
                  let data = {
                      code: 403,
                      message: Antl.formatMessage('messages.permission_denied'),
                      data:{}
                  }
                  response.status(403).send(data);
                  return;
              }
          }
      }
    }
    await next()
  }

  getAction(method)
  {
      let action;
      method = method.toLowerCase();
      switch ( method ) {
        case 'get':
          action = "is_view";
          break;
        case 'post':
          action = "is_add";
          break;
        case 'put':
          action = "is_update";
          break;
        case 'patch':
          action = "is_update";
          break;
        case 'delete':
          action = "is_delete";
          break;
      }
      return action
  }

}

module.exports = CheckModulePermission
