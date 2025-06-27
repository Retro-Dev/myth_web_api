'use strict'

const Controller = use('./Controller')
const ApplicationContent = use('App/Models/ApplicationContent');
const Faq = use('App/Models/Faq');
const _ = use('lodash');

class HomeController extends Controller
{
    async getContent({params, view, response})
    {
        let getContent =  await ApplicationContent.getContentBySlug(params.slug);
        if( _.isEmpty(getContent) ){
          response.redirect('/');
          return
        }
        return view.render('content',{ content: getContent });
    }

    async getFaq({params, view})
    {
        let records = await Faq.getFaq();
        return view.render('faq',{records:records});
    }

    async brainTreeDropIN({view})
    {
        return view.render('braintree-dropin');
    }

    async deepLink({params, view, request, response})
    {

      return view.render('deep-link', {slug: params.slug});
    }
}
module.exports = HomeController
