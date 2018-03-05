'use strict';

var app = angular.module('ptlab', ['ui.router', 'ngMaterial', 'materialCalendar', 'ngSanitize', 'ngMessages', 'duScroll']);

app.run(['$anchorScroll', '$location', '$rootScope', function($anchorScroll, $location, $rootScope) {
  $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
    if($location.hash()) $anchorScroll();
  });
}])

app.config([
'$stateProvider',
'$urlRouterProvider',
'$mdDateLocaleProvider',
'$locationProvider',
function($stateProvider, $urlRouterProvider, $mdDateLocaleProvider, $locationProvider) {
  $mdDateLocaleProvider.formatDate = function(date) {
    return moment(date).format('DD/MM/YYYY');
 };
 $mdDateLocaleProvider.months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
 $mdDateLocaleProvider.shortMonths = ['jan', 'feb', 'maa', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
 $mdDateLocaleProvider.days = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
 $mdDateLocaleProvider.shortDays = ['Zo', 'Ma', 'Di', 'Woe', 'Don', 'Vrij', 'Zat'];
 $mdDateLocaleProvider.firstDayOfWeek = 1;
 $locationProvider.hashPrefix('');
 $locationProvider.html5Mode({
       enabled: true,
       requireBase: false
  });
  $stateProvider
    .state('home', {
      url: '/home',
      controller: 'MainController',
      controllerAs: 'ctrl',
      templateUrl: '/templates/home.html',

    })
    .state('boekplaatsstudent', {
      url: '/boekplaatsstudent',
      controller: 'BoekPlaatsStudentController',
      controllerAs: 'ctrl',
      templateUrl: '/templates/boekplaatsstudent.html',
      onEnter: ['$state', 'auth', function ($state, auth) {
                if (!auth.isLoggedIn()) {
                    $state.go('login');
                }
            }]
    })
    .state('gratisplaats', {
      url: '/gratisplaats',
      controller: 'GratisPlaatsController',
      controllerAs: 'ctrl',
      templateUrl: '/templates/gratisplaats.html',
      onEnter: ['$state', 'auth', function ($state, auth) {
                if (!auth.isLoggedIn()) {
                    $state.go('login');
                }
            }]
    })
    .state('vraagofferteaan', {
      url: '/vraagofferteaan',
      controller: 'VraagOfferteAanController',
      controllerAs: 'ctrl',
      templateUrl: '/templates/vraagofferteaan.html',
      onEnter: ['$state', 'auth', function ($state, auth) {
                if (!auth.isLoggedIn()) {
                    $state.go('login');
                }
            }]
    })
    .state('contact', {
      url: '/contact',
      controller: 'ContactController',
      controllerAs: 'ctrl',
      templateUrl: '/templates/contact.html'
    })
    .state('login', {
      url: '/login',
      templateUrl: '/templates/login.html',
      controller: 'AuthController',
      controllerAs: 'ctrl',
      onEnter: ['$state', 'auth', function ($state, auth) {
                if (auth.isLoggedIn()) {
                    $state.go('home');
                }
            }]
      })
      .state('register', {
        url: '/register',
        templateUrl: '/templates/register.html',
        controller: 'AuthController',
        controllerAs: 'ctrl'
      })
      .state('changepassword', {
        url: '/changepassword',
        templateUrl: '/templates/changepassword.html',
        controller: 'AuthController',
        controllerAs: 'ctrl',
        onEnter: ['$state', 'auth', function ($state, auth) {
                  if (!auth.isLoggedIn()) {
                    $state.go('login');
                  }
              }]
        })
        .state('settings', {
          url: '/settings',
          templateUrl: '/templates/settings.html',
          controller: 'SettingsController',
          controllerAs: 'ctrl',
          onEnter: ['$state', 'auth', function ($state, auth) {
                    if (!auth.isLoggedIn()) {
                      $state.go('login');
                    } else {
                      if(!auth.isAdmin()){
                        $state.go('home')
                      }
                    }
                }]
        });
  $urlRouterProvider.otherwise('home');
}]);

// MAINCONTROLLER VOOR HOMEPAGINA
/*
app.controller('MainController', function ($scope, $http, $rootScope) {
  var vm = this;
  vm.openingsuren = [];

  //var previous = null;
  //var current = null;

  activate();

  function activate() {
      console.log("activate controller");
      getOpeningsuren();
      return vm.openingsuren;

              /*setInterval(function(){
                $.getJSON("/javascripts/content.json", function(json){
                  current = JSON.stringify(json);
                  if(previous && current && previous !== current){
                    console.log('refresh');
                    location.reload();
                  }
                  previous = current;
                });
              }, 2000);*//*
  }

  function getOpeningsuren(){
      return $http.get('/javascripts/content.json').success(function(data){
        vm.openingsuren = data.openingsuren.dag;
      });
        /*  $.getJSON("/javascripts/content.json", function (data) {
            $.each(data, function (index, value) {
              vm.openingsuren = data.openingsuren.dag;
              return vm.openingsuren;
            });
          });*//*
  }
});*/

// BOEK EEN PLAATS DOOR STUDENT CONTROLLER
/*app.controller('BoekPlaatsStudentController', ['$scope', '$http', function($scope, $http){
  var vm = this;
  vm.datum = getTodayDate();
  vm.isOpen = false;
  vm.student = null;
  vm.aantalPlaatsen = 20;

  function getTodayDate(){
    return new Date();
  }

  function boekPlaatsStudent(){
    if(vm.datum < getTodayDate()){};
    vm.aantalPlaatsen = 15;
    return vm.student;
  }
}]);*/

// GRATIS PLAATS BOEKEN DOOR EEN CO-WORKER
/*
app.controller('GratisPlaatsController', function($scope, $http){
  var vm = this;

});*/

// RUIMTE HUREN, OFFERTE AANVRAGEN DOOR MANAGER OF TRAINER VOOR TRAINING OF EVENT TE ORGANISEREN
/*
app.controller('VraagOfferteAanController', function($scope, $http){
  var vm = this;
});*/

// CONTACT CONTROLLER
/*app.controller('ContactController', function($scope, $http){
  var vm = this;
});*/


//Hiding the navbar collapsed when there is a click on a link in the nav menu.
/*
$(document).on('click','.navbar-collapse.in',function(e) {
    if( $(e.target).is('a:not(".dropdown-toggle")') ) {
        $(this).collapse('hide');
    }
});*/
