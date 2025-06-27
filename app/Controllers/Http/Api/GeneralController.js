'use strict';

const Controller   = require("../Controller");
const { generateVideoThumb, baseUrl } = use('App/Helpers/Index.js');
const Drive    = use('Drive');
const Env = use('Env')
const client = require('twilio')(Env.get('TWILIO_ACCOUNT_SID'), Env.get('TWILIO_AUTH_TOKEN'));

class GeneralController extends Controller
{
    constructor()
    {
        super();
        this.resource = "User"; //this is your resource name
        this.request; //adonis request obj
        this.response; //adonis response obj
        this.params = {}; // this is used for get parameters from url
    }

    async twilio({request, response})
    {
        client.messages
        .create({ from: Env.get('MOBILE_NO'), body: `twilio test message.`, to: request.all().mobile_no })
        .then(message => console.log(message.sid)).catch(err => console.log('<--------err-------->', err)
        );
    }

    async generateVideoThumbnail({request,response})
    {
        this.request  = request;
        this.response = response;

        let file      = request.file('file')
        var thumbnail = await generateVideoThumb(file.tmpPath,'videos');
            thumbnail = encodeURIComponent(thumbnail);


        this.__is_paginate = false;
        this.__collection  = false;

        this.sendResponse(
            200,
            'Video thumbnail has been generated successfully',
            { url: baseUrl('/file/get/' + thumbnail)  }
        );
        return;
    }

    async getFile({response,params})
    {
        let path = decodeURIComponent(params.path);
        const exists = await Drive.exists(path)
        if( exists ){
            let content = await Drive.get(path)
            return response.send(content);
        } else {
            return null;
        }
    }
}
module.exports = GeneralController
