'use strict'

const { first } = require("@adonisjs/lucid/src/Lucid/Model");
const RestModel  = use('./RestModel');
const _          = use('lodash');

class Faq extends RestModel {

    /**
     * The table associated with the model.
     *
     * @var string
     */
    static get table()
    {
      return "faqs";
    }

    /**
     * The field name used to set the creation timestamp (return null to disable):
     */
    static get createdAtColumn () {
      return 'created_at';
    }

    /**
     * The field name used to set the creation timestamp (return null to disable):
     */
    static get updatedAtColumn () {
      return 'updated_at';
    }

    static softdelete()
    {
        return true;
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    static getFields()
    {
        return [
            'slug','question','answer','created_at','updated_at','deleted_at'
        ];
    }

    /**
     * omit fields from database results
     */
    static get hidden ()
    {
      return []
    }

    /**
     * mention column for select query
     */
    static showColumns()
    {
        return [
          'slug', 'question', 'answer', 'created_at', 'updated_at'
        ];
    }

    static async getFaq()
    {
        let records = await this.query().whereNull('deleted_at').orderBy('id','asc').fetch();
        return _.isEmpty(records) ? [] : records.toJSON();
    }
}
module.exports = Faq
