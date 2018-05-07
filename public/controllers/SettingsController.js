(function(){
    'use strict';

    angular.module('ptlab').controller('SettingsController', SettingsController);

    SettingsController.$inject = ['auth', '$state', 'ruimteService', 'mailService', 'reservatieService', 'eventService', 'websiteService', '$mdToast', '$scope', '$timeout', '$mdDialog', '$mdPanel'];

    function SettingsController(auth, $state, ruimteService, mailService, reservatieService, eventService, websiteService, $mdToast, $scope, $timeout, $mdDialog, $mdPanel){
      var vm = this;
      vm.ruimtes = [];
      vm.events = [];
      vm.eventTypes = [];
      vm.reservaties = [];
      vm.users = [];

      vm.ruimte = {};
      vm.event = {};
      vm.admin = {};
      vm.reservatiesday = [];
      vm.eventsday = [];
      vm.dayReservaties = new Date();
      vm.dayEvents = new Date();
      vm.time;
      vm._mdPanel = $mdPanel;

      vm.todayDate = new Date();
      vm.minDate = null;
      vm.maxDate = null;

      vm.blockeddate;
      vm.blockeddatesyear = [];
      vm.highlightDays = [];
      vm.datesClicked = [];

      vm.getReservatiesByDay = getReservatiesByDay;
      vm.getRuimtes = getRuimtes;
      vm.getReservaties = getReservaties;
      vm.getEvents = getEvents;
      vm.getEventsByDay = getEventsByDay;
      vm.getEventTypes = getEventTypes;
      vm.getEndTime = getEndTime;
      vm.getUsers = getUsers;

      vm.createRuimte = createRuimte;
      vm.createEvent = createEvent;
      vm.createAdmin = createAdmin;
      vm.reload = reload;
      vm.deleteReservatie = deleteReservatie;
      vm.deleteEvent = deleteEvent;
      vm.updateRuimte = updateRuimte;
      vm.updateReservatie = updateReservatie;
      vm.blokkeerdata = blokkeerdata;
      vm.deleteBlockedDate = deleteBlockedDate;

      vm.test = {};

      vm.feestdagen = [];

      vm.disabledates = function(date) {
        var temp = new Date(date);
        var day = temp.getDay();
        var feestdag = isFeestdag(temp);
        var isblocked = isBlockedDate(temp);
        return day === 0 || day === 6 || feestdag || isblocked;
      };

      vm.selected = [];
      vm.limitOptions = [5, 10, 15];

      vm.options = {
        rowSelection: false,
        multiSelect: true,
        autoSelect: true,
        decapitate: false,
        boundaryLinks: true,
        limitSelect: true,
        pageSelect: true,
        label: "Pagina: "
      };

      vm.query = {
        orderreservaties: 'startdate',
        orderevents: 'startdate',
        orderruimte: 'name',
        ordereventsday: 'name',
        orderreservatiesday: 'user.fullName',
        limitEvents: 5,
        limit: 5,
        pageEvents: 1,
        page: 1
      };

      vm.toggleLimitOptions = function () {
        vm.limitOptions = vm.limitOptions ? undefined : [5, 10, 15];
      };

      vm.keuzeDagen = [{name: "Voormiddag", value: "voormiddag"}, {name: "Namiddag", value:"namiddag"}, {name: "Volledige dag", value:"volledigedag"}];

      activate();

      function activate(){
        berekenFeestdagen(vm.todayDate.getFullYear());
        berekenFeestdagen(vm.todayDate.getFullYear() + 1);
        vm.event.publiek = false;
        vm.event.catering = false;
        vm.minDate = new Date(vm.todayDate);
        vm.minDate.setDate(vm.todayDate.getDate()+5);
        vm.maxDate =  new Date(
          vm.todayDate.getFullYear(),
          vm.todayDate.getMonth() + 3,
          vm.todayDate.getDate()
        );
        websiteService.getAllBlockedDatesPastAndFromThisYear().then(function(res){
          res.data.forEach(function(yeardates){
            for(var i = 0; i < yeardates.blockeddates.length; i++){
              vm.blockeddatesyear.push(yeardates.blockeddates[i]);
              vm.highlightDays.push({
                date: yeardates.blockeddates[i],
                css: 'blockeddate-custom',
                selectable: false,
                title: 'test'
              });
            }
          });
          for(var i = 0; i < vm.feestdagen.length; i++){
            if(vm.feestdagen[i].getDay() === 0 || vm.feestdagen[i].getDay() === 6){
              vm.highlightDays.push({
                date: vm.feestdagen[i],
                css: 'blockeddate-holiday-weekends',
                selectable: false,
                title: 'Feestdag'
              });
            } else {
              vm.highlightDays.push({
                date: vm.feestdagen[i],
                css: 'blockeddate-holiday',
                selectable: false,
                title: 'Feestdag'
              });
            }
          }
        });
        getReservaties();
        getReservatiesByDay(Date.now());
        getEventsByDay(Date.now());
        getEvents();
        getEventTypes();
        getUsers();
        return getRuimtes();
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

      function isFeestdag(date) {
        date.setHours(0,0,0,0);
        for(var i = 0; i < vm.feestdagen.length; i++){
          if(date.getTime() === vm.feestdagen[i].getTime()){
            return true;
          }
        }
      }

      function isBlockedDate(date){
        date.setHours(0,0,0,0);
        for(var i = 0; i < vm.blockeddatesyear.length; i++){
          var temp = new Date(vm.blockeddatesyear[i]);
          if(temp.getTime() === date.getTime()){
            return true;
          }
        }
      }

      function reload(){
        vm.reloadreservations = $timeout(function () {
          getReservaties();
        }, 2000);
      }

      function getUsers(){
        auth.getAll().then(function(data) {
          data.data.forEach(function(u){
            if(u.typeUser === "MANAGER"){
              vm.users.push(u);
            }
          });
          return vm.users;
        });
      }

      function getRuimtes(){
        ruimteService.getAll().then(function(res){
          vm.ruimtes = res.data;
          return vm.ruimtes;
        });
      }

      function getReservaties(){
        reservatieService.getAll().then(function(res){
          vm.reservaties = res.data;
          return vm.reservaties;
        });
      }

      function getEvents(){
        eventService.getAll().then(function(res){
          vm.events = res.data;
          return vm.events;
        });
      }

      function getEventTypes(){
        eventService.getEventTypes().then(function(res){
          vm.eventTypes = res.data;
          return vm.eventTypes;
        });
      }

      function createRuimte(){
        ruimteService.create(vm.ruimte);
        return vm.ruimtes.push(vm.ruimte);
      }

      function createEvent(){
        vm.event.startdate.setHours(vm.starttime.getHours());
        vm.event.startdate.setMinutes(vm.starttime.getMinutes());
        var enddate = new Date(vm.event.startdate);
        enddate.setHours(vm.endtime.getHours());
        enddate.setMinutes(vm.endtime.getMinutes());

        //Bepalen of het event in de voormiddag of namiddag is, of het een volledige dag duurt.
        if(vm.event.startdate.getHours() >= 12){
          //Event begint na de middag.
          vm.event.keuzeDag = "namiddag";
        } else {
          //Bepaal voormiddag of volledige dag.
          if(enddate.getHours() > 12){
            //Het event zal ten vroegste om 13 uur eindigen.
            vm.event.keuzeDag = "volledigedag";
          } else {
            if (enddate.getHours() === 12){
              if(enddate.getMinutes() === 0){
                vm.event.keuzeDag = "voormiddag";
              } else {
                vm.event.keuzeDag = "volledigedag";
              }
            } else {
              //tempdate.getHours() < 12
              vm.event.keuzeDag = "voormiddag";
            }
          }
        }

        //Difference calculator
        var diff = enddate - vm.event.startdate;
        var minutesdiff = diff/(1000*60);

        vm.event.duur = minutesdiff;
        eventService.create(vm.event).success(function(){
          getEvents();
          vm.message = "";

          mailService.sendConfirmationEvent(vm.event);
          if(vm.event.keuzeDag == "volledigedag"){
            vm.event.price = vm.event.ruimte.price*2;
            vm.event.priceperperson = vm.event.ruimte.priceperperson*2;
          } else {
            vm.event.price = vm.event.ruimte.price;
            vm.event.priceperperson = vm.event.ruimte.priceperperson;
          }
          mailService.sendInvoiceManager(vm.event);

          $mdToast.show($mdToast.simple()
            .content('U hebt succesvol een evenement aangemaakt.')
           .position('bottom left')
           .parent($("#toast-container"))
           .hideDelay(3000));
        }).error(function(err){
          vm.message = err.message;
        });
        console.log(vm.event);

        return;
      }

      function getReservatiesByDay() {
        reservatieService.getReservatiesByDay(vm.dayReservaties).then(function (res) {
          vm.reservatiesday = res;
          return vm.reservatiesday
        });
      }

      function getEventsByDay() {
        eventService.getEventsByDay(vm.dayEvents).then(function (res) {
          vm.eventsday = res;
          return vm.eventsday;
        });
      }

      function getEndTime(ev) {
        var enddate = new Date(ev.startdate);
        var startdate = new Date(ev.startdate);
        enddate.setMinutes(startdate.getMinutes() + ev.duur);
        return enddate;
      }

      function deleteReservatie(selectedreservatie) {
        var confirm = $mdDialog.confirm()
          .title('Annuleer reservatie')
          .textContent('Bent u zeker dat u de reservatie wilt annuleren ?')
          .ariaLabel('Confirm deleteReservatie')
          .ok('Annuleer reservatie')
          .cancel('Cancel');

        $mdDialog.show(confirm).then(
          function() {//OK
            return reservatieService.deleteReservatie(selectedreservatie).then(function () {
              getReservaties();
              getReservatiesByDay(vm.dayReservaties);

              mailService.sendCancellationReservation(selectedreservatie);

              $mdToast.show($mdToast.simple()
              .content('Reservatie geannuleerd')
              .position('bottom left')
              .parent($("#toast-container"))
              .hideDelay(3000));
            });
          },
          function() {//Cancel
            $mdToast.show($mdToast.simple()
            .content('Reservatie is niet geannuleerd')
            .position('bottom left')
            .parent($("#toast-container-alert"))
            .hideDelay(3000));
          }
        );
      }

      function deleteEvent(selectedevent) {
        var confirm = $mdDialog.confirm()
          .title('Annuleer evenement')
          .textContent('Bent u zeker dat u het evenement wilt annuleren ?')
          .ariaLabel('Confirm deleteEvent')
          .ok('Annuleer evenement')
          .cancel('Cancel');

        $mdDialog.show(confirm).then(
          function() {//OK
            return eventService.deleteEvent(selectedevent).then(function () {
              getEvents();

              mailService.sendCancellationEvent(selectedevent);

              $mdToast.show($mdToast.simple()
              .content('Het evenement is geannuleerd')
              .position('bottom left')
              .parent($("#toast-container"))
              .hideDelay(3000));
            });
          },
          function() {//Cancel
            $mdToast.show($mdToast.simple()
            .content('Het evenement is niet geannuleerd')
            .position('bottom left')
            .parent($("#toast-container-alert"))
            .hideDelay(3000));
          }
        );
      }

      function updateRuimte(ruimte) {
        var position = vm._mdPanel.newPanelPosition()
          .absolute()
          .center();

        var config = {
          attachTo: angular.element(document.body),
          controller: 'UpdateRuimteController',
          controllerAs: 'ctrl',
          disableParentScroll: true,
          templateUrl: '/templates/updateruimte.html',
          hasBackdrop: true,
          panelClass: 'update-dialog-border',
          position: position,
          trapFocus: true,
          zIndex: 150,
          clickOutsideToClose: true,
          escapeToClose: true,
          focusOnOpen: true,
          locals: {
            ruimte: ruimte
          },
        };

        vm._mdPanel.open(config);
      }

      function updateReservatie(reservatie){
        var position = vm._mdPanel.newPanelPosition()
          .absolute()
          .center();

        var config = {
          attachTo: angular.element(document.body),
          controller: 'UpdateReservatieController',
          controllerAs: 'ctrl',
          disableParentScroll: true,
          templateUrl: '/templates/updatereservatiesettings.html',
          hasBackdrop: true,
          panelClass: 'update-dialog-border',
          position: position,
          trapFocus: true,
          zIndex: 80,
          clickOutsideToClose: false,
          escapeToClose: false,
          focusOnOpen: true,
          locals: {
            reservatie: reservatie
          },
        };

        vm._mdPanel.open(config);
      }

      function createAdmin(form) {
        vm.admin.typeUser = "MANAGER";
        vm.admin.isAdmin = true;
        vm.admin.password = vm.admin.username;
        auth.register(vm.admin).error(function(error){
          vm.error = error;
          if(vm.error.message === "User already exists") {
            form.username.$error.exists = true;
          }
        }).then(function(){
          $mdToast.show($mdToast.simple()
          .content('Administrator succesvol aangemaakt.')
          .position('bottom left')
          .parent($("#toast-container"))
          .hideDelay(3000));
          //$state.go('login');
        });
      }

      function blokkeerdata(){
        if(vm.datesClicked.length > 0){
          for(var i = 0; i < vm.datesClicked.length; i++){
            var temp = new Date(vm.datesClicked[i]._d);
            checkAndBlockDate(temp);
          }
          vm.datesClicked.length = 0;
        }
      }// EINDE blokkeerdata()

      function checkAndBlockDate(date){
        websiteService.getBlockedDates(date.getFullYear()).then(function(res){
          if(res.data){
            websiteService.updateBlockedDates(date).then(function(re) {
              vm.highlightDays.push({
                date: date,
                css: 'blockeddate-custom',
                selectable: false,
                title: 'Blocked'
              });
              vm.blockeddatesyear.push(date);
            });
          } else {
            websiteService.createBlockedDates(date).then(function(r){
              vm.highlightDays.push({
                date: date,
                css: 'blockeddate-custom',
                selectable: false,
                title: 'Blocked'
              });
              vm.blockeddatesyear.push(date);
            });
          }
        });
      }

      function deleteBlockedDate(){
        websiteService.deleteBlockedDate({
          year: vm.test.date.getFullYear(),
          blockeddates: vm.test.date
        }).then(function(res){
          for(var i = 0; i < vm.highlightDays.length; i++){
            var temp = new Date(vm.highlightDays[i].date);
            var tempyear = new Date(vm.blockeddatesyear[i]);
            if(temp.getTime() === vm.test.date.getTime()){
              vm.highlightDays.splice(i, 1);
            }
            if(tempyear.getTime() === vm.test.date.getTime()){
              vm.blockeddatesyear.splice(i, 1);
            }
          }
        });
      }


    } // EINDE SettingsController
})();
