(function () {
    'use strict';
    angular.module('ptlab')
    .directive('scaleBlocks', function() {
      var link = function(scope, element, attrs){
        // Get height from all 3 blocks
        var heightTrainer = $('#trainerblock').height();
        var heightCoworker = $('#coworkingblock').height();
        var heightStudent = $('#studentenblock').height();

        //Deteremine the highest block
        var maxheight = Math.max(heightTrainer, heightCoworker, heightStudent);
        //Set the height of all textboxes to the same height on page load;
        $('#trainerblock').height(maxheight);
        $('#coworkingblock').height(maxheight);
        $('#studentenblock').height(maxheight);
      };

      return {
          restrict: 'A',
          link: link
      };
    });

})();
