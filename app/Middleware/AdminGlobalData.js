'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const ApplicationSetting = use('App/Models/ApplicationSetting');
const Category = use('App/Models/Category');

class AdminGlobalData {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ view }, next) {
    // call next to advance the request
    let applicationSetting = await ApplicationSetting.getApplicationSetting({identifier:'application_setting'});
    let categories = await Category.getCategories({});
    view.share({
      categories: categories,
      applicationSetting: applicationSetting,
      currentYear: new Date().getFullYear()
    })
    await next()
  }
}

module.exports = AdminGlobalData
