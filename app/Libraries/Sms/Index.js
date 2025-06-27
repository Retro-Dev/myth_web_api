'use strict';

const Env = use('Env');

class Index
{
    static instance()
    {
        let Sms =  use("App/Libraries/Sms/" + Env.get('SMS_GATEWAY'));
        return new Sms;
    }
}
module.exports = Index
