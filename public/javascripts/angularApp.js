var app = angular.module('ptlab', ['ui.router', 'ngMaterial', 'ngMessages']);

app.config([
'$stateProvider',
'$urlRouterProvider',
'$mdDateLocaleProvider',
function($stateProvider, $urlRouterProvider, $mdDateLocaleProvider) {
  $mdDateLocaleProvider.formatDate = function(date) {
    return moment(date).format('DD MMMM YYYY');
 };
 $mdDateLocaleProvider.months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
 $mdDateLocaleProvider.shortMonths = ['jan', 'feb', 'maa', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
 $mdDateLocaleProvider.days = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
 $mdDateLocaleProvider.shortDays = ['Zo', 'Ma', 'Di', 'Woe', 'Don', 'Vrij', 'Zat'];
 $mdDateLocaleProvider.firstDayOfWeek = 1;
  $stateProvider
    .state('home', {
      url: '/home',
      controller: 'OpeningsurenController',
      controllerAs: 'ctrl',
      templateUrl: '/templates/home.html'
      /*resolve: {
        openingsuren: function($stateParams, OpeningsurenController){
          return OpeningsurenController.getOpeningsuren();
        }
      }*/
    })
    .state('boekplaatsstudent', {
      url: '/boekplaatsstudent',
      controller: 'BoekPlaatsStudentController',
      controllerAs: 'ctrl',
      templateUrl: '/templates/boekplaatsstudent.html'
    })
    /*
    .state('voorwie', {
      url: '/voorwie',
      controller: 'VoorwieController',
      controllerAs: 'ctrl'
    })
    .state('ruimtes', {
      url: '/ruimtes',
      controller: 'RuimtesController',
      controllerAs: 'ctrl'
    })
    .state('prijzen', {
      url: '/prijzen',
      controller: 'PrijzenController',
      controllerAs: 'ctrl'
    })
    .state('practicals', {
      url: '/practicals',
      controller: 'PracticalsController',
      controllerAs: 'ctrl'
    })
    .state('agenda', {
      url: '/agenda',
      controller: 'AgendaController',
      controllerAs: 'ctrl'
    })*/
    .state('contact', {
      url: '/contact',
      templateUrl: '/templates/contact.html',
    });

  $urlRouterProvider.otherwise('home');
}]);

app.controller('OpeningsurenController', function ($scope, $http, $rootScope) {
  var vm = this;
  vm.openingsuren = [];
  vm.maandag = "Maandag";

  $rootScope.$on('$viewContentLoading', function(event, viewConfig)
  {
    console.log("in $rootScope");
    // code die wordt uitgevoerd voor de view gerendered wordt.
    activate();
  });

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
        console.log("hallo controller");
        return getOpeningsuren();
      }

      function getOpeningsuren(){
          $.getJSON("/javascripts/content.json", function (data) {
            $.each(data, function (index, value) {
              vm.openingsuren = data.openingsuren.dag;

              console.log(JSON.stringify(vm.openingsuren));
              return vm.openingsuren;
            });
          });
      }

      function testController(){
        console.log("WE ZITTEN IN DE CONTROLLER");
      }
});

app.controller('BoekPlaatsStudentController', function($scope, $http){
  var vm = this;
  vm.datum = new Date();
  vm.isOpen = false;

  function getTodayDate(){
    return new Date();
  }
});



//Hiding the navbar collapsed when there is a click on a link in the nav menu.
/*
$(document).on('click','.navbar-collapse.in',function(e) {
    if( $(e.target).is('a:not(".dropdown-toggle")') ) {
        $(this).collapse('hide');
    }
});*/
