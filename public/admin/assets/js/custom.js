$.ajaxSetup({
  headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
  }
});
(function($) {
	"use strict";

    //Left nav scroll
    $(".nano").nanoScroller();

    // Left menu collapse
    $('.left-nav-toggle a').on('click', function (event) {
        event.preventDefault();
        $("body").toggleClass("nav-toggle");
    });

	// Left menu collapse
    $('.left-nav-collapsed a').on('click', function (event) {
        event.preventDefault();
        $("body").toggleClass("nav-collapsed");
    });

	// Left menu collapse
    $('.right-sidebar-toggle').on('click', function (event) {
        event.preventDefault();
        $("#right-sidebar-toggle").toggleClass("right-sidebar-toggle");
    });

	//metis menu
   $('#menu').metisMenu();

    //slim scroll
    $('.scrollDiv').slimScroll({
        color: '#eee',
        size: '5px',
        height: '293px',
        alwaysVisible: false
    });

	//tooltip popover
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();

})(jQuery);

var ajaxRequest = (url, method, params = {}) => {

  return new Promise( (resolve,reject) => {
      $.ajax({
          type: method,
          url: url,
          data: params,
          beforeSend: function(){
              $('button').attr('disbaled','disabled');
              $('input[type="submit"]').attr('disabled','disabled');
          },
          success: function(data){
              $('button').removeAttr('disabled');
              $('input[type="submit"]').removeAttr('disabled');
              resolve(data);
          },
          error: function(jqXHR, exception) {
              if (jqXHR.status === 0) {
                  alert('Not connect.\n Verify Network.');
              } else if (jqXHR.status == 404) {
                  resolve(jqXHR.responseJSON);
              } else if (jqXHR.status == 500) {
                  alert('Internal Server Error [500].');
              } else if (exception === 'parsererror') {
                  alert('Requested JSON parse failed.');
              } else if (exception === 'timeout') {
                  alert('Time out error.');
              } else if (exception === 'abort') {
                  alert('Ajax request aborted.');
              } else {
                  alert('Uncaught Error.\n' + jqXHR.responseText);
              }
          }
      });
  })
}
