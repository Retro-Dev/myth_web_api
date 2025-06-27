const Route = use('Route');

Route.on('/delete-account').render('delete-account')
Route.on('/account-deleted').render('account-deleted')
Route.on('/account-verified').render('account-verified')
Route.on('/password-changed').render('password-changed')
Route.on('/').render('welcome')
Route.get('deep-link/:slug','HomeController.deepLink');
Route.get('file/get/:path','Api/GeneralController.getFile');
Route.on('encrypt-data').render('encrypt-data')
Route.get('user/verify-email/:email','UserController.verifyEmail');
Route.get('user/reset-password/:resetpasstoken','UserController.resetPassword');
Route.get('content/:slug','HomeController.getContent');
Route.get('faq','HomeController.getFaq');
Route.post('user/reset-password','UserController.resetPasswordSubmit');
Route.post('user/delete-account','UserController.deleteAccountSubmit');
Route.get('braintree/dropin','HomeController.brainTreeDropIN');
