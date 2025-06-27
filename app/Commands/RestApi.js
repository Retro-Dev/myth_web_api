'use strict'

const { Command } = require('@adonisjs/ace')
const fs = require("fs");
const Helpers = use('Helpers')
const { kebabCase } = use('App/Helpers/Index.js');

class RestApi extends Command {

    static get signature () {
      return `
        rest:api
        { Model : Generate Rest Api resource name}  }
        { Type : type = api | admin }
      `
    }

    static get description () {
      return 'Generate Rest Api Resource {model name} { type: api, admin}'
    }

    async handle (args, options) {
      this.info(`${args.Model} rest module is generating`)
      if( args.Type == 'api' ){
          await this.generateApiRestModule(args.Model);
      } else {
        await this.generateAdminRestModule(args.Model);
      }
      this.success(`${args.Model} rest module has been generated successfully`)
    }

    async generateApiRestModule(model)
    {
        await this.generateModel(model);
        await this.generateApiHook(model);
        await this.generateApiController(model);
        await this.generateApiResource(model);
    }

    async generateAdminRestModule(model)
    {
        await this.generateModel(model);
        await this.generateAdminHook(model);
        await this.generateAdminController(model);
        await this.generateCrudFile(model);
    }

    async generateModel(model)
    {
      if (!fs.existsSync(`App/Models/${model}.js`)){
        let modelContent = fs.readFileSync('App/Commands/RestStuff/SampleModel.stuff',{ encoding: 'utf8' });
            modelContent =  modelContent.replaceAll('[MODEL]',model);
            fs.writeFileSync(`App/Models/${model}.js`,modelContent);
      }
    }

    async generateApiHook(model)
    {
      if (!fs.existsSync(`App/Models/Hooks/Api/${model}Hook.js`)){
        let modelContent = fs.readFileSync('App/Commands/RestStuff/api/SampleHook.stuff',{ encoding: 'utf8' });
            modelContent =  modelContent.replaceAll('[MODEL]',model);
            fs.writeFileSync(`App/Models/Hooks/Api/${model}Hook.js`,modelContent);
      }
    }

    async generateApiController(model)
    {
      if (!fs.existsSync(`App/Controllers/Http/Api/${model}Controller.js`)){
        let modelContent = fs.readFileSync('App/Commands/RestStuff/api/SampleRestController.stuff',{ encoding: 'utf8' });
            modelContent =  modelContent.replaceAll('[MODEL]',model);
            fs.writeFileSync(`App/Controllers/Http/Api/${model}Controller.js`,modelContent);
      }
    }

    async generateApiResource(model)
    {
      if (!fs.existsSync(`App/Controllers/Http/Resource/${model}.js`)){
        let modelContent = fs.readFileSync('App/Commands/RestStuff/api/SampleResource.stuff',{ encoding: 'utf8' });
            modelContent =  modelContent.replaceAll('[MODEL]',model);
            fs.writeFileSync(`App/Controllers/Http/Resource/${model}.js`,modelContent);
      }
    }

    async generateAdminHook(model)
    {
      if (!fs.existsSync(`App/Models/Hooks/Admin/${model}Hook.js`)){
        let modelContent = fs.readFileSync('App/Commands/RestStuff/Admin/SampleHook.stuff',{ encoding: 'utf8' });
            modelContent =  modelContent.replaceAll('[MODEL]',model);
            fs.writeFileSync(`App/Models/Hooks/Admin/${model}Hook.js`,modelContent);
      }
    }

    async generateAdminController(model)
    {
      if (!fs.existsSync(`App/Controllers/Http/Admin/${model}Controller.js`)){
        let modelContent = fs.readFileSync('App/Commands/RestStuff/admin/SampleCrudController.stuff',{ encoding: 'utf8' });
            modelContent =  modelContent.replaceAll('[MODEL]',model);
            fs.writeFileSync(`App/Controllers/Http/Admin/${model}Controller.js`,modelContent);
      }
    }

    async generateCrudFile(model)
    {
        let resourcesPath = Helpers.resourcesPath()
        let dir = resourcesPath + '/views/admin/' + kebabCase(model);
        if ( !fs.existsSync(dir) ) {
            //create dir
            fs.mkdirSync(dir);
            //create add
            let addContent = fs.readFileSync('App/Commands/RestStuff/Admin/add.edge',{ encoding: 'utf8' });
            fs.writeFileSync(`${resourcesPath}/views/admin/${kebabCase(model)}/add.edge`,addContent);
            //create edit
            let editContent = fs.readFileSync('App/Commands/RestStuff/Admin/edit.edge',{ encoding: 'utf8' });
            fs.writeFileSync(`${resourcesPath}/views/admin/${kebabCase(model)}/edit.edge`,editContent);
             //create index
             let indexContent = fs.readFileSync('App/Commands/RestStuff/Admin/index.edge',{ encoding: 'utf8' });
             fs.writeFileSync(`${resourcesPath}/views/admin/${kebabCase(model)}/index.edge`,indexContent);
             //create detail
             let detailContent = fs.readFileSync('App/Commands/RestStuff/Admin/detail.edge',{ encoding: 'utf8' });
             fs.writeFileSync(`${resourcesPath}/views/admin/${kebabCase(model)}/detail.edge`,detailContent);
        }
    }
}

module.exports = RestApi
