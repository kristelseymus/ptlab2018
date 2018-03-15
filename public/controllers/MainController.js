(function() {

    'use strict';

    angular.module('ptlab').controller('MainController', MainController);

    MainController.$inject = ['$http', '$log', 'auth', '$state', '$stateParams', 'eventService', 'MaterialCalendarData', '$scope', '$mdDialog', '$timeout'];

    function MainController($http, $log, auth, $state, $stateParams, eventService, MaterialCalendarData, $scope, $mdDialog, $timeout) {
        var vm = this;
        vm.users = [];
        vm.getUsers = getUsers;
        vm.openingsuren = [];
        vm.events = [];
        vm.setDayContent = setDayContent;
        vm.dateClicked = new Date();
        $scope.dayClick = dayClick;
        vm.showDialog = showDialog;
        vm.eventsday = {};
        vm.getEventsByDay = getEventsByDay;
        vm.userStudent = true;
        vm.userCoworker = true;
        vm.userManager = true;
        vm.dayContent = "";

        activate();


        function activate() {
          return load();
        }
        function load(){
            getUsers();
            getOpeningsuren();
            getEvents();
            /*switch (auth.getCurrentUser().typeuser) {
              case "STUDENT": vm.userStudent = false
                break;
              case "COWORKER": vm.userCoworker = false
                break;
              case "MANAGER": vm.userManager = false
                break;
            }
            if(auth.getCurrentUser().isAdmin){
              //False is niet gedisabled
              vm.userStudent = false;
              vm.userCoworker = false;
              vm.userManager = false;
            }*/
            //eventsByDay(new Date());
        }

        function getUsers() {
            return auth.getAll()
                .then(function(data) {
                    vm.users = data.data;
                    return vm.users;
                });
        }

        function getOpeningsuren(){
          //Moet naar websiteService
            return $http.get('/javascripts/content.json').success(function(data){
              vm.openingsuren = data.openingsuren.dag;
            });
        }

        function getEvents(){
          vm.events = eventService.getAll().then(function(res){
            vm.events = res.data;
            var evenement;

            //Met een tweedimensionale array kan een datum gebruikt worden als een key
            //en de value gekoppeld aan deze key zou dan een array zijn van evenementen.
            //Met andere woorden zullen de evenementen dan gegroepeerd/verzameld worden op datum.

            //Doorloop vm.events
            //Als er een gelijke datum zich al in de 1ste dimensie bevindt, dan zal het evenement
            //toegevoegd worden aan deze datum zijn array.

            //Wanneer er geen datum gevonden wordt die overeenkomt, dan zal er een nieuwe datum
            //toegevoegd worden in de eerste dimensie. Het evenement kan hier dan worden bijgevoegd.

            //Wanneer dan alle evenementen overlopen zijn, dan zal voor elke datum
            //de methode setDayContent aangeroepen worden met een string die gemaakt is van
            //html code met daarin alle evenementen van deze dag.

            //Wanneer dit dan afgelopen is dan zouden alle evenementen van deze dag samen moeten zitten
            //in 1 string bestaande uit een soort van html pagina met daarin blokken.
            //Elke block is dan een evenement met daarin de titel van het evenement.
            //var keyValues = {};
            //keyValues.id1 = {};
            //keyValues.id1.events = [];
            for(evenement of vm.events){
              //keyValues.id1.events.push(evenement);
              createContentCalendar(evenement);
              console.log(MaterialCalendarData.getDayKey(new Date(evenement.startdate)));
              setDayContent(evenement.startdate, vm.dayContent);
            }
            console.log(vm.dayContent);
            console.log(keyValues);
            return vm.events;
          });
        }

        function setDayContent(date, content){
          MaterialCalendarData.setDayContent(new Date(date), content);
        }

        function dayClick(date){
          vm.dateClicked = date;
          getEventsByDay(date);

        }

        function createContentCalendar(evenement){
          vm.dayContent = "<div class='item-box text-center'><h7>" + evenement.name + "</h7></div>";
          return vm.dayContent;
        }

        function showDialog(ev) {
          console.log("showDialog");
          console.log(vm.eventsday);
          $mdDialog.show({
            parent: angular.element(document.body),
            //controller: MainController,
            //controllerAs: 'ctrl',
            locals: {
              eventsday: vm.eventsday,
              day: vm.dateClicked
            },
            controller: 'CalendarController',
            controllerAs: 'ctrl',
            templateUrl: '/templates/dialogevent.html',
            hasBackdrop: true,
            panelClass: 'dialog-events',
            targetEvent: ev,
            clickOutsideToClose: true,
            escapeToClose: true,
            allowParentalScroll: true
          });
        }

        function getEventsByDay(date){
          vm.eventsday = eventService.getEventsByDay(date).then(function(res){
            vm.eventsday = res;
            $timeout(showDialog, 0);
            return vm.eventsday;
          });
        }
    }

})();
