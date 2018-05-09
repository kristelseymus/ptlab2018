'use strict';

var app = angular.module('ptlab', ['ui.router', 'ngAnimate', 'ngMaterial', 'ngSanitize', 'ngMessages', 'duScroll', 'mdPickers', 'md.data.table', 'ui.carousel', 'multipleDatePicker']);

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
    moment.locale('nl', {
    months : 'Januari_Februari_Maart_April_Mei_Juni_Juli_Augustus_September_Oktober_November_December'.split('_'),
    monthsShort : 'jan._feb._mrt._apr._mei_juni_juli_aug._sept._okt._nov._dec.'.split('_'),
    monthsParseExact : true,
    weekdays : 'Zondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrijdag_Zaterdag'.split('_'),
    weekdaysShort : 'Zondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrijdag_Zaterdag'.split('_'),
    weekdaysMin : 'Zo_Ma_Di_Woe_Do_Vrij_Za'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Vandaag om] LT',
        nextDay : '[Morgen om] LT',
        nextWeek : 'dddd [om] LT',
        lastDay : '[Gisteren om] LT',
        lastWeek : '[Vorige] dddd [om] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'in %s',
        past : '%s geleden',
        s : 'een paar seconden',
        m : 'een minuut',
        mm : '%d minuten',
        h : 'een uur',
        hh : '%d uren',
        d : 'een dag',
        dd : '%d dagen',
        M : 'een maand',
        MM : '%d maanden',
        y : 'een jaar',
        yy : '%d jaren'
    },
    dayOfMonthOrdinalParse : /\d{1,2}(er|e)/,
    ordinal : function (number) {
        return number + (number === 1 ? 'er' : 'e');
    },
    meridiemParse : /PD|MD/,
    isPM : function (input) {
        return input.charAt(0) === 'M';
    },
    // In case the meridiem units are not separated around 12, then implement
    // this function (look at locale/id.js for an example).
    // meridiemHour : function (hour, meridiem) {
    //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
    // },
    meridiem : function (hours, minutes, isLower) {
        return hours < 12 ? 'PD' : 'MD';
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
  });
  $mdDateLocaleProvider.formatDate = function(date) {
    return moment(date).format('DD/MM/YYYY');
  };
  $mdDateLocaleProvider.months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
  $mdDateLocaleProvider.shortMonths = ['jan', 'feb', 'maa', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  $mdDateLocaleProvider.days = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
  $mdDateLocaleProvider.shortDays = ['Zo', 'Ma', 'Di', 'Wo', 'Don', 'Vr', 'Za'];
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
      controller: 'ReservatieController',
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
      controller: 'ReservatieController',
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
      controller: 'ReservatieController',
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
        })
        .state('mijnreservaties', {
          url: '/mijnreservaties',
          templateUrl: '/templates/mijnreservaties.html',
          controller: 'ReservatieController',
          controllerAs: 'ctrl',
          onEnter: ['$state', 'auth', function ($state, auth) {
                    if (!auth.isLoggedIn()) {
                      $state.go('login');
                    }
                }]
        })
        .state('updatewebsite', {
          url: '/updatewebsite',
          templateUrl: '/templates/updatewebsite.html',
          controller: 'UpdateWebsiteController',
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
}]);// EINDE config

/*$(document).on('click','.navbar-collapse.in',function(e) {
    if( $(e.target).is('a:not(".dropdown-toggle")') ) {
        $(this).collapse('hide');
    }
});*/
