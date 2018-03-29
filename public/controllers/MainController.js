(function() {

    'use strict';

    angular.module('ptlab').controller('MainController', MainController);

    MainController.$inject = ['$http', '$log', 'auth', '$state', '$stateParams', 'eventService', 'ruimteService', 'MaterialCalendarData', '$scope', '$mdDialog', '$timeout'];

    function MainController($http, $log, auth, $state, $stateParams, eventService, ruimteService, MaterialCalendarData, $scope, $mdDialog, $timeout) {
        var vm = this;
        vm.users = [];
        vm.openingsuren = [];
        vm.events = [];
        vm.ruimtes = [];
        vm.setDayContent = setDayContent;
        vm.dateClicked = new Date();
        $scope.dayClick = dayClick;
        vm.openDialog = openDialog;
        vm.showDialog = showDialog;
        vm.eventsday = {};
        vm.getEventsByDay = getEventsByDay;
        vm.getUsers = getUsers;
        vm.getEndTime = getEndTime;
        vm.getRuimtes = getRuimtes;
        vm.userStudent = true;
        vm.userCoworker = true;
        vm.userManager = true;
        vm.dayContent = "";
        vm.event = {};

        vm.fotos = [];

        activate();


        function activate() {
          return load();
        }
        function load(){
          vm.fotos = [
            { url: "https://drive.google.com/thumbnail?id=1VxB7aHa9_dkOp8mPFgQ7WDUAR_unRlVB" },
            { url: "https://drive.google.com/thumbnail?id=1w1gKg95YPHSaReintAVyf7cj1q8g8jtQ" },
            { url: "https://drive.google.com/thumbnail?id=1_78hYcr3c2Zy-GKIaUKDTi547rgbzTQh" },
            { url: "https://drive.google.com/thumbnail?id=1S24B_CurBFZLp9_Ihha_BNkbCU0ARZIV" }
          ];
            getUsers();
            getOpeningsuren();
            getEvents();
            getRuimtes();
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

        function getRuimtes(){
          vm.ruimtes = ruimteService.getAll().then(function(res){
            vm.ruimtes = res.data;
            console.log(vm.ruimtes);
            for(var i=0; i<vm.ruimtes.length; i++){
              vm.ruimtes[i].img = vm.fotos[i].url;
            }
            return vm.ruimtes;
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
          vm.event = e;
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
