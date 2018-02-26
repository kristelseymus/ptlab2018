$(document).ready(function() {
  $("#meetingroomtitle").on('click', function(event) {
    console.log("click on meetingroom");
    $("#sectionCoworking").slideUp("slow", function() {
      $("#sectionBoardRoom").slideUp("slow", function(){
        $("#sectionTrainingRoom").slideUp("slow",function(){
          $("#sectionMeetingRoom").slideToggle("slow");
        });
      });
    });
  });
});

$(document).ready(function() {
  $("#trainingroomtitle").on('click', function(event) {
    console.log("click on trainingroom");
    $("#sectionCoworking").slideUp("slow", function() {
      $("#sectionMeetingRoom").slideUp("slow", function(){
        $("#sectionBoardRoom").slideUp("slow", function(){
          $("#sectionTrainingRoom").slideToggle("slow");
        });
      });
    });
  });
});

$(document).ready(function() {
  $("#boardroomtitle").on('click', function(event) {
    console.log("click on boardroom");
    $("#sectionCoworking").slideUp("slow", function() {
      $("#sectionMeetingRoom").slideUp("slow", function(){
        $("#sectionTrainingRoom").slideUp("slow", function(){
          $("#sectionBoardRoom").slideToggle("slow");
        });
      });
    });
  });
});

$(document).ready(function(){
  $("#coworkinglabtitle").on('click', function(event) {
    //if clicked again on the same section, the section needs to close.
    //if another  section is open, close the other section and open the one that is clicked on.
    console.log("click on coworking");
    $("#sectionMeetingRoom").slideUp("slow", function() {
      $("#sectionBoardRoom").slideUp("slow", function() {
        $("#sectionTrainingRoom").slideUp("slow", function() {
          $("#sectionCoworking").slideToggle("slow");
        });
      });
    });
  });
});
