const Route = use('Route');

Route.group(() => {

  Route.post('twilio','Api/GeneralController.twilio');
  Route.post('generate-video-thumb','Api/GeneralController.generateVideoThumbnail');
  Route.post('user/forgot-password','Api/UserController.forgotPassword').middleware('throttle:1000,3600'); //a day
  Route.post('user/login','Api/UserController.login').middleware('throttle:1000,86400');
  Route.post('user/social-login','Api/UserController.socialLogin').middleware('throttle:1000,86400');
  Route.resource('user', 'Api/UserController')
    .except(['destroy'])
    .middleware(new Map([
      [['index','show', 'update'], ['apiAuth']]
    ]))

   Route.get('truncate/database', 'Api/UserController.truncateDB');


}).prefix('api').middleware(['checkApiToken'])

Route.group(() => {

  Route.post('user/resend/code','Api/UserController.resendCode').middleware('throttle:5,86400'); //a day
  Route.post('user/verify/code','Api/UserController.verifyCode').middleware('throttle:5,86400'); //a day
  Route.post('user/change-password','Api/UserController.changePassword'); //a day
  Route.post('user/logout','Api/UserController.userLogout');
  Route.post('user/contact','Api/UserController.getContactUsers')

    // dashboard status
    Route.get('dashboard', 'Api/NotificationController.dashboardStatus')

  Route.get('notification','Api/NotificationController.index');
  Route.patch('notification/update/:unique_id', 'Api/NotificationController.updateNotification');
  Route.delete('notification/delete/:unique_id', 'Api/NotificationController.deleteNotification');
  Route.delete('notification/delete-all', 'Api/NotificationController.deleteAllNotification');
  Route.patch('notification/read', 'Api/NotificationController.readNotification');
  Route.post('send-notification','Api/NotificationController.sendNotification');
  Route.post('chat/send-notification','Api/NotificationController.sendChatNotification');

  Route.post('gateway/customer','Api/GatewayController.createCustomer');
  
  Route.get('panic/start','Api/PanicController.panicStart');
  Route.resource('panic','Api/PanicController');

  Route.resource('delete-other-panic','Api/DelOtherPanicController');

  Route.resource('subscription','Api/SubscriptionController');

  Route.resource('witness','Api/WitnessController');

  Route.post('post/report', 'Api/PostController.postReport')
  Route.resource('post','Api/PostController');
  
  Route.resource('police-officer','Api/PoliceOfficerController');
  
  Route.resource('event','Api/EventController').only(['show', 'index']);
  Route.resource('directory','Api/DirectoryController').only(['show', 'index']);
  Route.resource('category','Api/CategoryController').only(['show', 'index']);

  Route.post('post/like', 'Api/LikeController.likePost')
  Route.resource('like', 'Api/LikeController')

  Route.resource('comment', 'Api/CommentController')

  Route.resource('contact', 'Api/ContactController')

  Route.resource('review', 'Api/ReviewController')
  Route.resource('review-officer', 'Api/OfficerReviewController')

  Route.resource('media', 'Api/MediaController')
  .except(['update'])

}).prefix('api').middleware(['checkApiToken','apiAuth'])
