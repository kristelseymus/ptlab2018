var app = angular.module('ptlab', ['ui.router']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      controller: 'httpController',
      controllerAs: 'ctrl',
      templateUrl: '/templates/home.html'
    })
    .state('contact', {
      url: '/contact',
      templateUrl: '/templates/contact.html'
    });

  $urlRouterProvider.otherwise('home');
}]);

app.controller('httpController', function ($scope, $http) {
  var vm = this;
  vm.openingsuren = null;

  activate();
          /*  $http.get('http://localhost:3000/content.xml',
                {
                      transformResponse: function (cnv) {
                      var x2js = new X2JS();
                      var aftCnv = x2js.xml_str2json(cnv);
                      return aftCnv;
                }
            })
            .success(function (response) {
              console.log('TEST 123');
                console.log(response);
            })
            .error(function (data, status){
              console.error(data, status);
            });*/

      function activate(){
        return load();
      }

      function load(){
        getOpeningsuren();
      }

      function getOpeningsuren(){
          $.getJSON("/javascripts/content.json", function (data) {
            $.each(data, function (index, value) {
              vm.openingsuren = data.openingsuren
              console.log(vm.openingsuren);
              return vm.openingsuren;
            });
          });
      }
});


$(document).ready(function(){
  // Add smooth scrolling to all links
  $("a").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){

        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });
});

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

$(document).ready(function(){
    $(window).scroll(function(){
        if ($(this).scrollTop() > 100) {
            $('#scroll').fadeIn();
        } else {
            $('#scroll').fadeOut();
        }
    });
    $('#scroll').click(function(){
        $("html, body").animate({ scrollTop: 0 }, 600);
        return false;
    });
});

$(document).ready(function(){
  var images = ["images/Logo_PTLab-01.jpg","images/Logo_PTLab-02.jpg","images/Logo_PTLab-03.jpg"];
  var i = 0;
  $img = $("#logo");
  setInterval(function () {
        i++;
        if (i >= images.length) {
            i = 0;
        }
        $img.fadeOut(function () {
            $img.attr('src', images[i]).fadeIn();
        })
    }, 6000)
});

//Hiding the navbar collapsed when there is a click on a link in the nav menu.
/*
$(document).on('click','.navbar-collapse.in',function(e) {
    if( $(e.target).is('a:not(".dropdown-toggle")') ) {
        $(this).collapse('hide');
    }
});*/

//<div class="wrapper"> <div ng-show="error.message" class="alert alert-danger alert-custom" role="alert">{{error.message}}</div>      <form ng-submit="register()" class="form-signin">          <h2 class="form-signin-heading text-center">Register</h2>        <input type="text" class="form-control form-login" name="username" placeholder="Username" required                 ng-model="user.username"/>    <input type="email" class="form-control form-login" name="emailadres" placeholder="Email Address" required             autofocus ng-model="user.emailadres"/>    <input type="password" class="form-control form-login" name="password" placeholder="Password" required             ng-model="user.password"/><button class="btn btn-lg btn-primary btn-block" type="submit">Register</button>  </form></div>'
