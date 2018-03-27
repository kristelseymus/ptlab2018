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
        vm.openDialog = openDialog;
        vm.showDialog = showDialog;
        vm.eventsday = {};
        vm.getEventsByDay = getEventsByDay;
        vm.getEndTime = getEndTime;
        vm.userStudent = true;
        vm.userCoworker = true;
        vm.userManager = true;
        vm.dayContent = "";
        vm.testEvents = [];
        vm.event = {};

        activate();


        function activate() {
          return load();
        }
        function load(){
            getUsers();
            getOpeningsuren();
            getEvents();
            vm.eventsday = getEventsByDay(new Date());
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
            for(evenement of vm.events){
              createContentCalendar(evenement);
              setDayContent(evenement.startdate, vm.dayContent);
            }
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
          vm.dayContent = "<div class='item-box text-center'></div>";
          return vm.dayContent;
        }
        function getEndTime(ev){
          var tempDate = new Date(ev.startdate);
          tempDate.setMinutes(tempDate.getMinutes() + ev.duur);
          return tempDate;
        }

        function openDialog(e){
          console.log("openDialog");
          vm.event = e;
          console.log(vm.event);
          showDialog();
        }

        function showDialog(ev) {
          console.log("showDialog");
          console.log(vm.event);
          $mdDialog.show({
            parent: angular.element(document.body),
            //controller: MainController,
            //controllerAs: 'ctrl',
            locals: {
              eventday: vm.event,
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
            //$timeout(showDialog, 0);
            return vm.eventsday;
          });
        }
    }

})();
