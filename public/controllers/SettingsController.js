(function(){
    'use strict';

    angular.module('ptlab').controller('SettingsController', SettingsController);

    SettingsController.$inject = ['auth', '$state', 'ruimteService', 'mailService', 'reservatieService', 'eventService', '$mdToast', '$scope', '$timeout', '$mdDialog', '$mdPanel'];

    function SettingsController(auth, $state, ruimteService, mailService, reservatieService, eventService, $mdToast, $scope, $timeout, $mdDialog, $mdPanel){
      var vm = this;
      vm.ruimtes = [];
      vm.events = [];
      vm.eventTypes = [];
      vm.reservaties = [];
      vm.users = [];

      vm.ruimte = {};
      vm.event = {};
      vm.reservatiesday = [];
      vm.eventsday = [];
      vm.day = new Date();
      vm.time;
      vm._mdPanel = $mdPanel;

      vm.todayDate = new Date();
      vm.minDate = null;
      vm.maxDate = null;

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
      vm.reload = reload;
      vm.deleteReservatie = deleteReservatie;
      vm.deleteEvent = deleteEvent;
      vm.updateRuimte = updateRuimte;

      vm.weekendDisable = function(date) {
        var temp = new Date(date);
        var day = temp.getDay();
        return day === 0 || day === 6;
      };

      vm.keuzeDagen = [{name: "Voormiddag", value: "voormiddag"}, {name: "Namiddag", value:"namiddag"}, {name: "Volledige dag", value:"volledigedag"}];

      activate();

      function activate(){
        vm.event.publiek = false;
        vm.event.catering = false;
        vm.minDate = new Date(vm.todayDate);
        vm.minDate.setDate(vm.todayDate.getDate()+5);
        vm.maxDate =  new Date(
          vm.todayDate.getFullYear(),
          vm.todayDate.getMonth() + 3,
          vm.todayDate.getDate()
        );
        getReservaties();
        getReservatiesByDay(Date.now());
        getEventsByDay(Date.now());
        getEvents();
        getEventTypes();
        getUsers();
        return getRuimtes();
      }

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
        limit: 5,
        page: 1
      };

      vm.toggleLimitOptions = function () {
        vm.limitOptions = vm.limitOptions ? undefined : [5, 10, 15];
      };

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
          console.log(vm.reservaties);
          return vm.reservaties;
        });
      }

      function getEvents(){
        eventService.getAll().then(function(res){
          vm.events = res.data;
          console.log(vm.events);
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
        var tempdate;

        //Bepalen of het event in de voormiddag of namiddag is, of het een volledige dag duurt.
        if(vm.event.startdate.getHours() >= 12){
          //Event begint na de middag.
          vm.event.keuzeDag = "namiddag";
        } else {
          //Bepaal voormiddag of volledige dag.
          tempdate = new Date(vm.event.startdate)
          tempdate.setMinutes(tempdate.getMinutes() + vm.event.duur);
          if(tempdate.getHours() > 12){
            //Het event zal ten vroegste om 13 uur eindigen.
            vm.event.keuzeDag = "volledigedag";
          } else {
            if (tempdate.getHours() === 12){
              if(tempdate.getMinutes() === 0){
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
          vm.events.push(vm.event);

          mailService.sendConfirmationEvent(vm.event);

          //Factuur opstellen voor een manager: automatisch of niet ?
          //mailService.sendInvoiceManager(vm.event);
        });
        console.log(vm.event);
        $mdToast.show($mdToast.simple()
          .content('U hebt succesvol een evenement aangemaakt.')
         .position('bottom left')
         .parent($("#toast-container"))
         .hideDelay(3000)

       );
        return;
      }

      function getReservatiesByDay() {
        reservatieService.getReservatiesByDay(vm.day).then(function (res) {
          vm.reservatiesday = res;
          console.log(vm.reservatiesday);
          console.log(vm.day);
          return vm.reservatiesday
        });
      }

      function getEventsByDay() {
        eventService.getEventsByDay(vm.day).then(function (res) {
          vm.eventsday = res;
          console.log(vm.eventsday);
          console.log(vm.day);
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
            selectedreservatie.user = selectedreservatie.user._id;
            return reservatieService.deleteReservatie(selectedreservatie).then(function () {
              getReservaties();
              getReservatiesByDay(vm.day);

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
    } // EINDE SettingsController
})();
