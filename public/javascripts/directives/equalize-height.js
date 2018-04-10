(function () {
    'use strict';
    angular.module('ptlab')
    .directive("equalizeHeight", ['$window', function($window) {
      return {
        restrict: "A",
        link: function(scope, element, attrs) {
          angular.element($window).bind('resize', function(){

            scope.$digest();
          });
          var parent = element.parent();
          attrs.$set("height", parent.prop("offsetHeight"));
          element.css("height", parent.prop("offsetHeight") + "px");
        }
      };
    }]);
})();
