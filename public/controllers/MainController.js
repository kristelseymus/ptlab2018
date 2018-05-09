(function() {

    'use strict';

    angular.module('ptlab').controller('MainController', MainController);

    MainController.$inject = ['$http', '$log', 'auth', '$state', '$stateParams', 'eventService', 'ruimteService', 'websiteService', '$scope', '$mdDialog', '$timeout'];

    function MainController($http, $log, auth, $state, $stateParams, eventService, ruimteService, websiteService, $scope, $mdDialog, $timeout) {
        var vm = this;
        vm.users = [];
        vm.events = [];
        vm.ruimtes = [];
        vm.dateClicked = [];
        vm.selectedDate = new Date();
        vm.todayDate = new Date();
        vm.highlightDays = [];
        vm.feestdagen = [];
        vm.eventsday = {};

        $scope.dayClick = dayClick;
        vm.openDialog = openDialog;
        vm.showDialog = showDialog;
        vm.getEventsByDay = getEventsByDay;
        vm.getUsers = getUsers;
        vm.getEndTime = getEndTime;
        vm.getRuimtes = getRuimtes;
        vm.toggleShow = toggleShow;
        vm.getUurString = getUurString;

        vm.userStudent = true;
        vm.userCoworker = true;
        vm.userManager = true;
        vm.event = {};

        vm.home = "";
        vm.prijzen = "";
        vm.voorwie = {};
        vm.practicals = {};
        vm.practicals.openingsuren = [];

        activate();

        function activate() {
          return load();
        }
        function load(){
          berekenFeestdagen(vm.todayDate.getFullYear());
          berekenFeestdagen(vm.todayDate.getFullYear() + 1);
          for(var i = 0; i < vm.feestdagen.length; i++){
            if(vm.feestdagen[i].getDay() != 0 && vm.feestdagen[i].getDay() != 6){
              vm.highlightDays.push({
                date: vm.feestdagen[i],
                css: 'blockeddate-holiday',
                selectable: false,
                title: 'Feestdag'
              });
            }
          }
          websiteService.getAllBlockedDatesPastAndFromThisYear().then(function(res){
            res.data.forEach(function(yeardates){
              for(var i = 0; i < yeardates.blockeddates.length; i++){
                vm.highlightDays.push({
                  date: yeardates.blockeddates[i],
                  css: 'blockeddate-holiday',
                  selectable: false,
                  title: 'test'
                });
              }
            });
          });
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

        function berekenFeestdagen(Y){
          //Date maken -> maanden = 0 tot 11
          var pasen; //Nodig voor andere data te berekenen
          pasen = getEasterDate(Y);
          var paasmaandag; //pasen = zondag
          paasmaandag = new Date(pasen);
          paasmaandag.setDate(paasmaandag.getDate() + 1);
          var nieuwjaar = new Date(Y, 0, 1); // Jan = 0
          var dagvandearbeid;
          dagvandearbeid = new Date(Y, 4, 1); // Mei = 4
          var olhhemelvaart; // 39 dagen na pasen
          olhhemelvaart = new Date(pasen);
          olhhemelvaart.setDate(olhhemelvaart.getDate() + 39);
          var pinksteren; // 10 dagen na OLH hemelvaart
          pinksteren = new Date(olhhemelvaart);
          pinksteren.setDate(pinksteren.getDate() + 10);
          var pinkstermaandag; //pinksteren = zondag
          pinkstermaandag = new Date(pinksteren);
          pinkstermaandag.setDate(pinkstermaandag.getDate() + 1);
          var nationalefeestdag = new Date(Y, 6, 21); // 21 Juli -> 7 wordt 6
          var olvhemelvaart = new Date(Y, 7, 15); // 15 Augustus
          var allerheiligen = new Date(Y, 10, 1); // 1 November
          var wapenstilstand = new Date(Y, 10, 11); // 11 November
          var kerstmis = new Date(Y, 11, 25); // 25 December

          vm.feestdagen.push(pasen);
          vm.feestdagen.push(paasmaandag);
          vm.feestdagen.push(nieuwjaar);
          vm.feestdagen.push(dagvandearbeid);
          vm.feestdagen.push(olhhemelvaart);
          vm.feestdagen.push(pinksteren);
          vm.feestdagen.push(pinkstermaandag);
          vm.feestdagen.push(nationalefeestdag);
          vm.feestdagen.push(olvhemelvaart);
          vm.feestdagen.push(allerheiligen);
          vm.feestdagen.push(wapenstilstand);
          vm.feestdagen.push(kerstmis);
        }

        function getEasterDate(Y) {
          var C = Math.floor(Y/100);
          var N = Y - 19*Math.floor(Y/19);
          var K = Math.floor((C - 17)/25);
          var I = C - Math.floor(C/4) - Math.floor((C - K)/3) + 19*N + 15;
          I = I - 30*Math.floor((I/30));
          I = I - Math.floor(I/28)*(1 - Math.floor(I/28)*Math.floor(29/(I + 1))*Math.floor((21 - N)/11));
          var J = Y + Math.floor(Y/4) + I + 2 - C + Math.floor(C/4);
          J = J - 7*Math.floor(J/7);
          var L = I - J;
          var M = 3 + Math.floor((L + 40)/44);
          var D = L + 28 - 31*Math.floor(M/4);
          return new Date(Y, M-1, D);
        }

        function getUsers() {
            return auth.getAll()
                .then(function(data) {
                    vm.users = data.data;
                    return vm.users;
                });
        }

        function getContents(){
            websiteService.getContent().then(function(res){
              console.log(res.data);
              vm.home = res.data.home;
              vm.voorwie.imagevoorwie = res.data.imagevoorwie;
              $scope.imagevoorwie = res.data.imagevoorwie;
              vm.voorwie.manager = res.data.voorwiemanager;
              vm.voorwie.coworker = res.data.voorwiecoworker;
              vm.voorwie.student = res.data.voorwiestudent;
              vm.practicals.content = res.data.practicals;
              vm.practicals.adres = res.data.adres;
              vm.practicals.openingsuren = res.data.openingsuren;
              /*vm.home = data.data.home.content;
              vm.voorwie = data.data.voorwie;
              vm.prijzen = data.data.prijzen;
              vm.practicals = data.data.practicals;
              vm.practicals.openingsuren = data.data.practicals.openingsuren.dag;*/
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
            }
            return vm.events;
          });
        }

        function getRuimtes(){
          vm.ruimtes = ruimteService.getAll().then(function(res){
            vm.ruimtes = res.data;
            return vm.ruimtes;
          });
        }

        function dayClick(event, date){
          vm.dateClicked.length = 0;
          vm.selectedDate = date.date._d;
          getEventsByDay(vm.selectedDate);
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

        function getUurString(time){
          var uur = "";
          var temp;
          var min;

          if(time%60 === 0){
            temp = time/60;
            uur = temp + "u00";
            return uur;
          } else {
            min = time%60;
            temp = (time - min)/60;
            uur = temp + "u" + min;
            return uur;
          }
        }
    } // EINDE MainController

})();
