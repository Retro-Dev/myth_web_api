'use strict'
const { validateAll, rule } = use("Validator");
const Controller = require("../Controller");
const { fileValidation } = use('App/Helpers/Index.js');
const _ = use('lodash');
const Antl = use('Antl');
const FileUpload = use('App/Libraries/FileUpload/FileUpload.js');
const Config = use('Config');
const ApplicationSettingModel = use('App/Models/ApplicationSetting');
const {storageUrl} = use("App/Helpers/Index.js");

class ApplicationSetting extends Controller
{
    async index({request, response, view, session})
    {
        if( request.method() == 'POST' ){
            return this._submitApplicationSetting(request, response, session);
        }
        return view.render('admin.application-setting.index')
    }

    async _submitApplicationSetting(request, response, session)
    {
        let params = request.all();
        let rules = {
            app_name: 'required|min:2|max:50',
            meta_keyword: 'min:2|max:10000',
            meta_description: 'min:2|max:10000'
        }
        let validator = await validateAll(request.all(), rules);

        if (validator.fails()) {
            let errorMessages = await this.webValidateRequestParams(validator)
            session.withErrors({errors: errorMessages }).flashAll()
            return response.redirect('back')
        }
        //logo validation
        if( !_.isEmpty(request.file('logo')) )
        {
            let fileValidate = fileValidation(request.file('logo'),6000000);
            if ( fileValidate.error ) {
              session.withErrors({error: fileValidate.message }).flashAll()
              return response.redirect('back')
            }
            //upload image
            params.logo = await FileUpload.doUpload( request.file('logo'), Config.get('constants.APP_SETTING_IMAGE_PATH'))
            params.logo = storageUrl(params.logo)
        } else {
            params.logo = params.old_logo;
        }
        //favicon validation
        if( !_.isEmpty(request.file('favicon')) )
        {
            let fileValidate = fileValidation(request.file('favicon'),6000000);
            if ( fileValidate.error ) {
              session.withErrors({error: fileValidate.message }).flashAll()
              return response.redirect('back')
            }
            //upload image
            params.favicon = await FileUpload.doUpload( request.file('favicon'), Config.get('constants.APP_SETTING_IMAGE_PATH'))
            params.favicon = storageUrl(params.favicon)
        } else {
            params.favicon = params.old_favicon;
        }
        delete params._csrf;
        params.identifier = 'application_setting';
        params.slug = 'application_setting';
        //delete old application setting
        await ApplicationSettingModel.query().where('identifier','application_setting').delete();
        //add new application setting
        ApplicationSettingModel.create(params);

        session.flash({success: Antl.formatMessage('messages.success_update_message') });
        response.redirect('back');
        return;
    }
}
module.exports = ApplicationSetting
