'use strict'
const gateway = use('App/Libraries/Payment/Index');

class GatewayController extends Controller
{
    constructor()
    {
        this.gateway  = gateway.instance();
        this.resource = "";
        this.request; //adonis request obj
        this.response; //adonis response obj
        this.params = {}; // this is used for get parameters from url
    }

    async createCustomer({request,response})
    {
        this.request  = request;
        this.response = response;

        return await this.gateway.createCustomer(request.input('email'));

    }
}
module.exports = GatewayController;
