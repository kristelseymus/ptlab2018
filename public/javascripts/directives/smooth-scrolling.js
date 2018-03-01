(function () {
    'use strict';
    angular.module('ptlab')
    .directive('smoothScrolling', ['$location', '$anchorScroll', function($location, $anchorScroll) {
      var link = function(scope, element, attrs){
        $(".navigatieitem").on('click', function(event) {

          if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;

            var elem = angular.element(document.getElementById('navigatieitem'));
    $document.scrollToElement(someElement, offset, duration);
          //  $('html, body').animate({
          //    scrollTop: $(hash).offset().top
        //    }, 800, function(){
        //      window.location.hash = hash;
        //    });
          }
        });
      };

      return {
          restrict: 'A',
          link: link
      };
    }]);

})();
