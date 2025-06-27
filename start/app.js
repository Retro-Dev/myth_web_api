'use strict'

const path = use('path');

/*
|--------------------------------------------------------------------------
| Providers
|--------------------------------------------------------------------------
|
| Providers are building blocks for your Adonis app. Anytime you install
| a new Adonis specific package, chances are you will register the
| provider here.
|
*/
const providers = [
  '@adonisjs/framework/providers/AppProvider',
  '@adonisjs/framework/providers/ViewProvider',
  '@adonisjs/lucid/providers/LucidProvider',
  '@adonisjs/bodyparser/providers/BodyParserProvider',
  '@adonisjs/cors/providers/CorsProvider',
  '@adonisjs/shield/providers/ShieldProvider',
  '@adonisjs/session/providers/SessionProvider',
  '@adonisjs/auth/providers/AuthProvider',
  '@adonisjs/antl/providers/AntlProvider',
  '@adonisjs/validator/providers/ValidatorProvider',
  '@adonisjs/mail/providers/MailProvider',
  '@adonisjs/drive/providers/DriveProvider',
  'adonis-throttle/providers/ThrottleProvider',
  '@adonisjs/redis/providers/RedisProvider',
  //'lucid-mongo/providers/LucidMongoProvider',
  path.join(__dirname, '..', 'app/Providers', 'AdminServiceProvider')
]

/*
|--------------------------------------------------------------------------
| Ace Providers
|--------------------------------------------------------------------------
|
| Ace providers are required only when running ace commands. For example
| Providers for migrations, tests etc.
|
*/
const aceProviders = [
  '@adonisjs/lucid/providers/MigrationsProvider',
  //'lucid-mongo/providers/MigrationsProvider',
]

/*
|--------------------------------------------------------------------------
| Aliases
|--------------------------------------------------------------------------
|
| Aliases are short unique names for IoC container bindings. You are free
| to create your own aliases.
|
| For example:
|   { Route: 'Adonis/Src/Route' }
|
*/
const aliases = {
  Throttle: 'Adonis/Addons/Throttle'
}

/*
|--------------------------------------------------------------------------
| Commands
|--------------------------------------------------------------------------
|
| Here you store ace commands for your package
|
*/
const commands = [
  'App/Commands/RestApi'
]

module.exports = { providers, aceProviders, aliases, commands }
