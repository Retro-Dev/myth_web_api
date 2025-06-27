'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class AdminServiceProvider extends ServiceProvider {

  register () {
    // register bindings
  }

  boot () {
    const {baseUrl,storageUrl} = this.app.use("App/Helpers/Index.js");

    const View    = this.app.use('Adonis/Src/View')
    View.global('currentTime', function () {
      return new Date().getTime()
    })
    
    View.global('storageUrl', function (path='/') {
      return storageUrl(path)
    })
  }
}

module.exports = AdminServiceProvider
