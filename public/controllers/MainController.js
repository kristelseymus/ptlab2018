(function() {

    'use strict';

    angular.module('ptlab').controller('MainController', MainController);

    MainController.$inject = ['$http', '$log', 'auth', '$state', '$stateParams', 'eventService', 'ruimteService', 'websiteService', 'MaterialCalendarData', '$scope', '$mdDialog', '$timeout'];

    function MainController($http, $log, auth, $state, $stateParams, eventService, ruimteService, websiteService, MaterialCalendarData, $scope, $mdDialog, $timeout) {
        var vm = this;
        vm.users = [];
        vm.events = [];
        vm.ruimtes = [];
        vm.setDayContent = setDayContent;
        vm.dateClicked = [];
        vm.selectedDate = new Date();

        vm.highlightDays = [];

        $scope.dayClick = dayClick;
        vm.openDialog = openDialog;
        vm.showDialog = showDialog;
        vm.eventsday = {};
        vm.getEventsByDay = getEventsByDay;
        vm.getUsers = getUsers;
        vm.getEndTime = getEndTime;
        vm.getRuimtes = getRuimtes;

        vm.toggleShow = toggleShow;

        vm.userStudent = true;
        vm.userCoworker = true;
        vm.userManager = true;
        vm.dayContent = "";
        vm.event = {};

        vm.fotos = [];
        vm.roomDetails = {};

        vm.home = "";
        vm.prijzen = {};
        vm.voorwie = {};
        vm.practicals = {};
        vm.practicals.openingsuren = [];

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
            getContents();
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

        function getContents(){
            websiteService.getWebsiteContent().then(function(data){
              vm.home = data.data.home.content;
              vm.voorwie = data.data.voorwie;
              vm.prijzen = data.data.prijzen;
              vm.practicals = data.data.practicals;
              vm.practicals.openingsuren = data.data.practicals.openingsuren.dag;
            });
        }

        function getEvents(){
          vm.events = eventService.getAll().then(function(res){
            vm.events = res.data;
            var evenement;
            for(evenement of vm.events){
              vm.highlightDays.push({
                date: evenement.startdate,
                css: 'events',
                selectable: true,
                title: evenement.name
              });
              createContentCalendar(evenement);
              setDayContent(evenement.startdate, vm.dayContent);
            }
            return vm.events;
          });
        }

        function getRuimtes(){
          vm.ruimtes = ruimteService.getAll().then(function(res){
            vm.ruimtes = res.data;
            for(var i=0; i<vm.ruimtes.length; i++){
              vm.ruimtes[i].img = vm.fotos[i].url;
            }
            return vm.ruimtes;
          });
        }

        function setDayContent(date, content){
          MaterialCalendarData.setDayContent(new Date(date), content);
        }

        function dayClick(event, date){
          vm.dateClicked.length = 0;
          vm.selectedDate = date.date._d;
          console.log(vm.dateClicked);
          console.log(date.date._d);
          getEventsByDay(vm.selectedDate);
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
          $mdDialog.show({
            parent: angular.element(document.body),
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

        function toggleShow(ruimte){
          if(!ruimte.show || ruimte.show === 'undefined'){
            ruimte.show = true
          } else {
            ruimte.show = false
          }
        }
    } // EINDE MainController

})();
