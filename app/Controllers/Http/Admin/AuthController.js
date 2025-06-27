'use strict'

const { validateAll, rule } = use("Validator");
const Controller = require("../Controller");
const Hash         = use('Hash');
const _            = use('lodash');
const User         = use('App/Models/User');
const Antl         = use('Antl');
const { fileValidation } = use('App/Helpers/Index.js');
const FileUpload = use('App/Libraries/FileUpload/FileUpload.js');
const Config = use('Config');

class AuthController extends Controller
{
    async login({request, view, response, session, auth})
    {
        let params = request.all();
        if( params.auth_token != Config.get('constants.LOGIN_AUTH_TOKEN') ){
            response.redirect('/');
            return;
        }
        if( request.method() == 'POST' )
          return this._submitLogin(request,response,session,auth)

        return view.render('admin.auth.login');
    }

    async _submitLogin(request,response,session,auth)
    {
        const rules = {
            email: 'required',
            password: 'required'
        }
        const validation = await validateAll(request.all(), rules)

        if (validation.fails()) {
          let errorMessages = await this.webValidateRequestParams(validation)
          session.withErrors({errors: errorMessages }).flashAll()
          return response.redirect('back')
        }

        let params = request.all();
        let user   = await User.adminAuth(params.email);

        if( _.isEmpty(user) ){
          session.withErrors({error: Antl.formatMessage('messages.invalid_user') }).flashAll()
          return response.redirect('back')
        }

        let checkPass = await Hash.verify(params.password, user.password)
        if( !checkPass ){
          session.withErrors({error: Antl.formatMessage('messages.invalid_user') }).flashAll()
          return response.redirect('back')
        }

        if( user.status == false || user.status == 'false' || user.status == "0" || user.status == 0 ){
          session.withErrors({error: Antl.formatMessage('messages.account_disabled')  }).flashAll()
          return response.redirect('back')
        }

        await auth.login(user)

        return response.route('admin.dashboard');
    }

    async forgotPassword({request,response, view, session})
    {
        if( request.method() == 'POST' )
          return this._submitForgotPassword(request,response,session)

        return view.render('admin.auth.forgot-password');
    }

    async _submitForgotPassword(request,response,session)
    {
        let params = request.all();
        let rules = {
            "email" : 'required|email',
        }
        let validator = await validateAll(request.all(), rules);
        if (validator.fails()) {
          let errorMessages = await this.webValidateRequestParams(validator)
          session.withErrors({errors: errorMessages }).flashAll()
          return response.redirect('back')
        }
        //get user by email
        let user = await User.getUserByEmail(params.email);
        if( _.isEmpty(user) ){
          session.withErrors({error: Antl.formatMessage('messages.email_not_exist') }).flashAll()
          return response.redirect('back')
        }

        User.forgotPassword(user).then( () => {} );

        session.flash({ success: Antl.formatMessage('messages.forgot_pass_msg') })
        response.route('admin.login');
        return;
    }

    async profile({request,response,session,view, auth})
    {
        if( request.method() == 'POST' )
          return this._submitProfile(request,response,session, auth)

        return view.render('admin.auth.profile');
    }

    async _submitProfile(request,response,session, auth)
    {
        let params = request.all();
        let rules = {
            name: 'required|min:2|max:50',
            email: `required|email|unique:users,email,id,${auth.user.id}`,
            mobile_no: `required|max:13|unique:users,mobile_no,id,${auth.user.id}`
        }
        let validator = await validateAll(request.all(), rules);

        if (validator.fails()) {
            let errorMessages = await this.webValidateRequestParams(validator)
            session.withErrors({errors: errorMessages }).flashAll()
            return response.redirect('back')
        }
        //image validation
        if( !_.isEmpty(request.file('image_url')) )
        {
            let fileValidate = fileValidation(request.file('image_url'),6000000);
            if ( fileValidate.error ) {
              session.withErrors({error: fileValidate.message }).flashAll()
              return response.redirect('back')
            }
            //upload image
            params.image_url = await FileUpload.doUpload( request.file('image_url'), Config.get('constants.USER_IMAGE_PATH'))
        } else {
            params.image_url = params.old_file;
        }

        let update_data = {
            name: params.name,
            email: params.email,
            mobile_no: params.mobile_no,
            image_url: params.image_url,
            updated_at: new Date()
        };
        await User.updateUser({slug:auth.user.slug},update_data);

        session.flash({success: Antl.formatMessage('messages.success_store_message')});
        response.redirect('back');
        return;
    }

    async changePassword({request,response,session,view, auth})
    {
        if( request.method() == 'POST' )
          return this._submitChangePassword(request,response,session, auth)

        return view.render('admin.auth.change-password');
    }

    async _submitChangePassword(request,response,session, auth)
    {
        let rules = {
            "current_password" : 'required',
            "new_password" : [
                'required',
                rule('regex',/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,150}$/)
            ],
            "confirm_password" : 'required|same:new_password',
        }
        let validator = await validateAll(request.all(), rules);

        if (validator.fails()) {
            let errorMessages = await this.webValidateRequestParams(validator)
            session.withErrors({errors: errorMessages }).flashAll()
            return response.redirect('back')
        }

        let user   = auth.user;
        let params = request.all();
        //check old password
        let checkCurrentPass = await Hash.verify(params.current_password,user.password)
        if( !checkCurrentPass ){
            session.withErrors({errors: Antl.formatMessage('messages.invalid_current_password') }).flashAll()
            return response.redirect('back')
        }
         //check current and old password
        if( params.current_password == params.new_password ){
            session.withErrors({errors: Antl.formatMessage('messages.password_same_error') }).flashAll()
            return response.redirect('back')
        }

        //update new password
        let update_params = {
            password: await Hash.make(params.new_password)
        }
        //update user
        await User.updateUser({email:user.email},update_params);

        session.flash({success: Antl.formatMessage('messages.update_password_msg')});
        response.redirect('back');
        return;
    }

    async logout({auth, session, response})
    {
        await auth.logout()
        session.flash({success: Antl.formatMessage('messages.logout_msg')})
        response.redirect('/admin/login?auth_token=' + Config.get('constants.LOGIN_AUTH_TOKEN'));
        return;
    }
}
module.exports = AuthController
