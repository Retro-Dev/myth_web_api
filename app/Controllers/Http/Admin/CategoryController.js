'use strict'
const { validateAll, rule } = use("Validator");
const CrudController = require("./CrudController");
const moment = use('moment');
const { baseUrl } = use('App/Helpers/Index.js');

class CategoryController extends CrudController {
    constructor() {
        super('Category')
        this.__data['page_title'] = 'CATEGORY';
        this.__indexView = 'category.index';
        this.__createView = 'category.add';
        this.__editView = 'category.edit';
        this.routeName = 'categories';
        this.request; //adonis request obj
        this.response; //adonis response obj
        this.params = {}; // this is used for get parameters from url
    }

    async validation(action, slug = null) {
        let rules = {};
        switch (action) {
            case "store":
                rules = {
                    name: 'required|min:2|max:150',
                    // status: 'required|in:0,1',
                }
                break;
            case "update":
                rules = {
                    name: 'required|min:2|max:150',
                    // status: 'required|in:0,1',
                }
                break;
        }
        let validator = await validateAll(this.request.all(), rules)
        return validator;
    }

    async beforeRenderIndexView() {

    }

    async dataTableRecords(record) {
        let options = `<a href="${baseUrl('/admin/categories/' + record.slug + '/edit')}" title="edit" class="btn btn-sm btn-info"><i class="fa fa-edit"></i></a>`;
        // options += '<a title="Delete" class="btn btn-sm btn-danger _delete_record"><i class="fa fa-trash"></i></a>';
        return [
            record.name,
            record.status == '1' ? `<span class="label label-success">Active</span>` : `<span class="label label-danger">Disabled</span>`,
            // moment(record.created_at).format('MM-DD-YYYY hh:mm A'),
            options
        ];
    }

    async beforeRenderCreateView() {

    }

    async beforeStoreLoadModel() {

    }

    async afterStoreLoadModel(record) {

    }

    async beforeRenderEditView(record) {

    }

    async beforeUpdateLoadModel() {

    }

    async afterUpdateLoadModel(record) {

    }

    async beforeDeleteLoadModel() {

    }
}
module.exports = CategoryController
