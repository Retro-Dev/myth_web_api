'use strict'
/*
|--------------------------------------------------------------------------
| DatabaseSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')
const { strSlug } = use('App/Helpers/Index');
const Hash = use('Hash')
const fs = use('fs');
const path = use('path')

class DatabaseSeeder
{
    async run () {
        await this.userGroup();
        await this.users();
        await this.cmsModules();
        await this.applicationSetting();
        await this.contentManagement();
        await this.mailTemplates();
        await this.directoryCategories();
    }

    async userGroup()
    {
        await Database.table('user_groups').insert([
          {
            id: 1,
            title: 'Super Admin',
            slug: strSlug('Super Admin'),
            type: 'admin',
            is_super_admin: '1',
            created_at: new Date(),
          },
          {
            id: 2,
            title: 'Admin',
            slug: strSlug('Admin'),
            type: 'admin',
            is_super_admin: '0',
            created_at: new Date(),
          },
          {
            id: 3,
            title: 'App User',
            slug: strSlug('App User'),
            type: 'user',
            is_super_admin: '0',
            created_at: new Date(),
          }
        ]);
    }

    async users()
    {
        await Database.table('users').insert({
            user_group_id: 1,
            user_type: 'admin',
            name: 'Myth',
            username: 'myth',
            slug: 'myth',
            email: 'mythsafe@gmail.com',
            mobile_no: '1-8882051816',
            password: await Hash.make('MYTHsafe@123'),
            is_email_verify: '1',
            email_verify_at: new Date(),
            is_mobile_verify: '1',
            mobile_verify_at: new Date(),
            created_at: new Date()
        })
    }

    async directoryCategories()
    {
        await Database.table('directory_categories').insert({
            name: 'Police Officer',
            slug: 'police-officer',
            created_at: new Date()
        })
    }

    async cmsModules()
    {
        await Database.table('cms_modules').insert([
          {
            parent_id: 0,
            name: 'Cms Roles Management',
            route_name: 'cms-roles-management.index',
            icon: 'fa fa-key',
            status: '1',
            sort_order: 1,
            created_at: new Date()
          },
          {
            parent_id: 0,
            name: 'Cms Users Management',
            route_name: 'cms-users-management.index',
            icon: 'fa fa-users',
            status: '1',
            sort_order: 2,
            created_at: new Date()
          },
          {
            parent_id: 0,
            name: 'Application Setting',
            route_name: 'admin.application-setting',
            icon: 'fa fa-cog',
            status: '1',
            sort_order: 3,
            created_at: new Date()
          },
          {
            parent_id: 0,
            name: 'Users Management',
            route_name: 'app-users.index',
            icon: 'fa fa-users',
            status: '1',
            sort_order: 4,
            created_at: new Date()
          },
          {
            parent_id: 0,
            name: 'Content Management',
            route_name: 'content-management.index',
            icon: 'fa fa-tasks',
            status: '1',
            sort_order: 5,
            created_at: new Date()
          },
          {
            parent_id: 0,
            name: `FAQ's`,
            route_name: 'faq.index',
            icon: 'fa fa-question-circle-o',
            status: '1',
            sort_order: 6,
            created_at: new Date()
          }
        ])
    }

    async applicationSetting()
    {
        await Database.table('application_settings').insert([
          {
            identifier: 'application_setting',
            meta_key: 'favicon',
            value: '/images/favicon.png',
            is_file: '1',
            created_at: new Date(),
          },
          {
            identifier: 'application_setting',
            meta_key: 'logo',
            value: '/images/logo.png',
            is_file: '1',
            created_at: new Date(),
          },
          {
            identifier: 'application_setting',
            meta_key: 'application_name',
            value: 'Myth',
            is_file: '0',
            created_at: new Date(),
          }
        ])
    }

    async contentManagement()
    {
        let content = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
        await Database.table('content_managements').insert([
          {
            title: 'About US',
            slug: 'about-us',
            content: content,
            status: '1',
            created_at: new Date(),
          },
          {
            title: 'Privacy Policy',
            slug: 'privacy-policy',
            content: content,
            status: '1',
            created_at: new Date(),
          },
          {
            title: 'Terms & Conditions',
            slug: 'terms-conditions',
            content: content,
            status: '1',
            created_at: new Date(),
          },
          {
            title: 'FAQ',
            slug: 'faq',
            content: content,
            status: '1',
            created_at: new Date(),
          },
          {
            title: 'Know Your Rights',
            slug: 'know-your-rights',
            content: fs.readFileSync(path.join(__dirname, './know-your-rights.txt'),'utf8'),
            status: '1',
            created_at: new Date(),
          }
        ])
    }

    async mailTemplates()
    {
        let user_registration_content = fs.readFileSync(path.join(__dirname, './user-registration.txt'),'utf8');
        let forgot_password_content   = fs.readFileSync(path.join(__dirname, './user-registration.txt'),'utf8');

        await Database.table('mail_templates').insert([
          {
              identifier:'user-registration',
              subject: 'Welcome to [APP_NAME]',
              body: user_registration_content,
              wildcard: '[USERNAME],[LINK],[YEAR],[APP_NAME]',
              created_at: new Date(),
          },
          {
              identifier:'forgot-password',
              subject: 'Forgot Password Confirmation',
              body: forgot_password_content,
              wildcard: '[USERNAME],[LINK],[YEAR],[APP_NAME]',
              created_at: new Date(),
          }
        ]);
    }
}
module.exports = DatabaseSeeder
