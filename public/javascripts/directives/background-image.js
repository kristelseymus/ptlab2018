(function () {
    'use strict';
    angular.module('ptlab')
    .directive('backgroundImage', function() {
      var link = function(scope, element, attrs) {
        scope.$watch('imagevoorwie', function(newVal) {
          if(newVal) {
            element.css({
              'background': 'linear-gradient(rgba(50, 50, 50, 0.6),rgba(50, 50, 50, 0.6)), url(' + newVal +') no-repeat bottom',
              'min-height': '500px'
            });
          }
        }, true);
      };

      return {
          restrict: 'A',
          link: link
      };
    });

})();
