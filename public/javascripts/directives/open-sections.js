(function () {
    'use strict';
    angular.module('ptlab')
    .directive('openSections', function() {
        var link = function(scope, element, attrs) {
          $("#meetingroomtitle").unbind().on('click', function(event) {
            $("#sectionCoworking").slideUp("slow", function() {
              $("#sectionBoardRoom").slideUp("slow", function(){
                $("#sectionTrainingRoom").slideUp("slow",function(){
                  $("#sectionMeetingRoom").slideToggle("slow");
                });
              });
            });
          });
          $("#trainingroomtitle").unbind().on('click', function(event) {
            $("#sectionCoworking").slideUp("slow", function() {
              $("#sectionMeetingRoom").slideUp("slow", function(){
                $("#sectionBoardRoom").slideUp("slow", function(){
                  $("#sectionTrainingRoom").slideToggle("slow");
                });
              });
            });
          });
          $("#boardroomtitle").unbind().on('click', function(event) {
            $("#sectionCoworking").slideUp("slow", function() {
              $("#sectionMeetingRoom").slideUp("slow", function(){
                $("#sectionTrainingRoom").slideUp("slow", function(){
                  $("#sectionBoardRoom").slideToggle("slow");
                });
              });
            });
          });
          $("#coworkinglabtitle").unbind().on('click', function(event) {
            $("#sectionMeetingRoom").slideUp("slow", function() {
              $("#sectionBoardRoom").slideUp("slow", function() {
                $("#sectionTrainingRoom").slideUp("slow", function() {
                  $("#sectionCoworking").slideToggle("slow");
                });
              });
            });
          });
        };

        return {
          restrict: 'A',
          link: link
        };
    });

})();
