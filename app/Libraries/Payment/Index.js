'use strict';

const Env = use('Env');

class Index
{
    static instance()
    {
        let Sms =  use("App/Libraries/Payment/" + Env.get('PAYMENT_GATEWAY'));
        return new Sms;
    }
}
module.exports = Index
