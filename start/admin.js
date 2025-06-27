const Route = use('Route')

Route.group(() => {

  Route.route('login', 'Admin/AuthController.login', ['GET', 'POST']).as('admin.login');
  Route.route('forgot-password', 'Admin/AuthController.forgotPassword', ['GET', 'POST']).as('admin.forgot-password');

}).prefix('admin').middleware(['redirectIfAuthenticate', 'AdminGlobalData']);

Route.group(() => {

  Route.get('dashboard', 'Admin/DashboardController.index').as('admin.dashboard');
  Route.route('profile', 'Admin/AuthController.profile', ['GET', 'POST']).as('admin.profile');
  Route.route('change-password', 'Admin/AuthController.changePassword', ['GET', 'POST']).as('admin.change-password');
  Route.get('logout', 'Admin/AuthController.logout').as('admin.logout');

  Route.route('application-setting', 'Admin/ApplicationSetting.index', ['GET', 'POST']).as('admin.application-setting');

  Route.route('user/edit/:slug', 'Admin/UserController.edit', ['GET', 'POST']).as('admin.user-edit');
  Route.get('users/ajax-listing', 'Admin/UserController.ajaxListing').as('admin.user.ajaxlsiting');
  Route.get('users', 'Admin/UserController.index').as('admin.user');

  Route.get('faq/ajax-listing', 'Admin/FaqController.ajaxListing').as('admin.faq.ajaxlsiting');
  Route.post('faq/update', 'Admin/FaqController.update').as('faq.update');
  Route.resource('faq', 'Admin/FaqController').except(['update']);

  Route.get('content/ajax-listing', 'Admin/ContentController.ajaxListing').as('admin.content.ajaxlsiting');
  Route.post('content/update', 'Admin/ContentController.update').as('content.update');
  Route.resource('content', 'Admin/ContentController');

  // event management
  Route.route('event/edit/:slug', 'Admin/EventController.edit', ['GET', 'POST']).as('admin.event-edit');
  Route.get('events/ajax-listing', 'Admin/EventController.ajaxListing').as('admin.event.ajaxlsiting');
  Route.get('events', 'Admin/EventController.index').as('admin.event');
  Route.resource('event', 'Admin/EventController').except(['update']);

  // panic management
  Route.route('panic/edit/:slug', 'Admin/PanicController.edit', ['GET', 'POST']).as('admin.panic-edit');
  Route.get('panics/ajax-listing', 'Admin/PanicController.ajaxListing').as('admin.panic.ajaxlsiting');
  Route.get('panics', 'Admin/PanicController.index').as('admin.panic');
  Route.resource('panic', 'Admin/PanicController').except(['update']);

  // Subscription management
  Route.route('subscription/edit/:slug', 'Admin/SubscriptionController.edit', ['GET', 'POST']).as('admin.subscription-edit');
  Route.get('subscriptions/ajax-listing', 'Admin/SubscriptionController.ajaxListing').as('admin.subscription.ajaxlsiting');
  Route.get('subscriptions', 'Admin/SubscriptionController.index').as('admin.subscription');
  Route.resource('subscription', 'Admin/SubscriptionController').except(['update']);

  // directory management
  Route.route('directory/edit/:slug', 'Admin/DirectoryController.edit', ['GET', 'POST']).as('admin.directory-edit');
  Route.get('directories/ajax-listing', 'Admin/DirectoryController.ajaxListing').as('admin.directory.ajaxlsiting');
  Route.get('directories', 'Admin/DirectoryController.index').as('admin.directory');
  Route.get('import-directories', 'Admin/DirectoryController.import').as('admin.directory-import'); // import csv
  Route.resource('directory', 'Admin/DirectoryController').except(['update']);

  // category management
  Route.get('categories/ajax-listing', 'Admin/CategoryController.ajaxListing').as('admin.categories.ajaxlsiting');
  Route.post('categories/update', 'Admin/CategoryController.update').as('category.update');
  Route.resource('categories', 'Admin/CategoryController').except(['update']);


  // newsfeed management
  Route.route('newsfeed/edit/:slug', 'Admin/PostController.edit', ['GET', 'POST']).as('admin.newsfeed-edit');
  Route.get('newsfeeds/ajax-listing', 'Admin/PostController.ajaxListing').as('admin.newsfeed.ajaxlsiting');
  Route.get('newsfeeds', 'Admin/PostController.index').as('admin.newsfeed');
  Route.resource('newsfeed', 'Admin/PostController').except(['update']);
  // report management
  Route.route('report/edit/:slug', 'Admin/ReportController.edit', ['GET', 'POST']).as('admin.report-edit');
  Route.get('reports/ajax-listing', 'Admin/ReportController.ajaxListing').as('admin.report.ajaxlsiting');
  Route.get('reports', 'Admin/ReportController.index').as('admin.report');
  Route.resource('report', 'Admin/ReportController').except(['update']);

  Route.get('chat', 'Admin/ChatController.index').as('chat.index');

}).prefix('admin').middleware(['AdminAuthenticate', 'AdminGlobalData'])
