'use strict'


module.exports =
{
    admin_login : {
       url:  window.constants.api_base_url + 'admin/login',
       method: 'POST'
    },

    admin_forgot_pass: {
       url:  window.constants.api_base_url + 'user/forgot-password',
       method: 'POST'
    },

    admin_update_user: {
       url:  window.constants.api_base_url + 'user/:user-slug',
       method: 'PATCH'
    },

    admin_chanage_pass: {
       url:  window.constants.api_base_url + 'user/change-password',
       method: 'POST'
    },

    get_application_setting: {
       url:  window.constants.api_base_url + 'admin/application-setting/app_setting',
       method: 'GET'
    },

    save_application_setting: {
       url:  window.constants.api_base_url + 'admin/application-setting',
       method: 'POST'
    },

    get_cms_role: {
       url: window.constants.api_base_url + 'admin/cms-role',
       method: 'GET'
    },

    get_cms_modules: {
       url: window.constants.api_base_url + 'admin/cms-module',
       method: 'GET'
    },

    add_cms_role: {
       url: window.constants.api_base_url + 'admin/cms-role',
       method: 'POST'
    },

    get_cms_role_by_slug: {
       url: window.constants.api_base_url + 'admin/cms-role/:slug',
       method: 'GET'
    },

    update_cms_role: {
        url: window.constants.api_base_url + 'admin/cms-role/:slug',
        method: 'PUT'
    },

   delete_cms_role: {
      url: window.constants.api_base_url + 'admin/cms-role/delete-record',
      method: 'DELETE'
   },

   add_cms_user: {
      url: window.constants.api_base_url + 'admin/cms-user',
      method: 'POST'
   },

   get_cms_user: {
      url: window.constants.api_base_url + 'admin/cms-user',
      method: 'GET'
   },

   get_cms_user_by_slug: {
        url: window.constants.api_base_url + 'admin/cms-user/:slug',
        method: 'GET'
   },

   update_cms_user: {
      url: window.constants.api_base_url + 'admin/cms-user/:slug',
      method: 'PUT'
   },

   delete_cms_user: {
        url: window.constants.api_base_url + 'admin/cms-user/delete-record',
        method: 'DELETE'
   },

   add_faq: {
        url: window.constants.api_base_url + 'admin/faq',
        method: 'POST'
    },

    get_faq: {
        url: window.constants.api_base_url + 'admin/faq',
        method: 'GET'
    },

    get_faq_by_slug: {
        url: window.constants.api_base_url + 'admin/faq/:slug',
        method: 'GET'
    },

    update_faq: {
        url: window.constants.api_base_url + 'admin/faq/:slug',
        method: 'PUT'
    },

    delete_faq: {
        url: window.constants.api_base_url + 'admin/faq/delete-record',
        method: 'DELETE'
    },

    get_content: {
        url: window.constants.api_base_url + 'admin/application-content',
        method: 'GET'
    },

    get_content_by_slug: {
        url: window.constants.api_base_url + 'admin/application-content/:slug',
        method: 'GET'
    },

    update_content: {
        url: window.constants.api_base_url + 'admin/application-content/:slug',
        method: 'PUT'
    },
}
