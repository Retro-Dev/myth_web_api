'use strict'
const { validateAll, rule } = use("Validator");
const Controller = require("../Controller");

class ChatController extends Controller
{
    async index({view})
    {
        return view.render('admin.chat.index')
    }


}
module.exports = ChatController
