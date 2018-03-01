(function () {
    'use strict';
    angular.module('ptlab')
    .directive('scrollToTop', function() {
      var link = function(scope, element, attrs){
        $(window).scroll(function(){
            if ($(this).scrollTop() > 100) {
                $('#scroll').fadeIn();
            } else {
                $('#scroll').fadeOut();
            }
        });
        $('#scroll').click(function(){
            $("html, body").animate({ scrollTop: 0 }, 1500);
            return false;
        });
      };

      return {
          restrict: 'A',
          link: link
      };
    });

})();
