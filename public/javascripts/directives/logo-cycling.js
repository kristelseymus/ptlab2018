(function () {
    'use strict';
    angular.module('ptlab')
    .directive('logoCycling', function() {
      var link = function(scope, element, attrs){
        var images = ["images/Logo_PTLab-01.jpg","images/Logo_PTLab-02.jpg","images/Logo_PTLab-03.jpg"];
        var i = 0;
        setInterval(function () {
              i++;
              if (i >= images.length) {
                  i = 0;
              }
              $("#logo").fadeOut(function () {
                  $("#logo").attr('src', images[i]).fadeIn();
              })
          }, 10000)
      };

      return {
          restrict: 'A',
          link: link
      };
    });

})();
