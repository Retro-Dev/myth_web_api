'use strict'

const Controller = require("../Controller");
const User = use("App/Models/User");
const moment = use('moment');
const _ = use('lodash');

class DashboardController extends Controller {

    async index({ request, response, view, auth }) {
        let params = request.all();
        let c_date = moment().format('YYYY')
        let chart_by_type = _.isEmpty(params.type) ? 'daily' : params.type
        let chart_by_start_date = _.isEmpty(params.start_date) ? c_date : params.start_date
        let chart_by_end_date = _.isEmpty(params.end_date) ? c_date : params.end_date
        let chart_by_month = _.isEmpty(params.search) ? c_date : params.search 
        let users = {}
        // get ufree ser count
        let unsubscribed_users = await User.getSubscriptionCount({ user_type: 'user', is_subscribed: '0' })
        // get free ser count
        let subscribed_users = await User.getSubscriptionCount({ user_type: 'user', is_subscribed: '1' })
        // get pending user count
        let pending_users = await User.getCount({ user_type: 'user', status: '0' })
        // get pending user count
        let approved_users = await User.getCount({ user_type: 'user', status: '1' })

        // get user count chart data
        let {resultArray : user_countby_month, type } = await User.getCountByMonth(chart_by_type,chart_by_start_date,chart_by_end_date,chart_by_month)

        let months = []
        let user_count = []
        for (let index = 0; index < user_countby_month.length; index++) {
            months.push(user_countby_month[index].month)
            user_count.push(user_countby_month[index].user_count)
            users.month = months
            users.user_count = user_count
        }

        return view.render('admin.dashboard.index', { unsubscribed_users, subscribed_users, pending_users, approved_users, users, type })
    }

}
module.exports = DashboardController
