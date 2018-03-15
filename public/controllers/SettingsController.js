(function(){
    'use strict';

    angular.module('ptlab').controller('SettingsController', SettingsController);

    SettingsController.$inject = ['auth', '$state', 'ruimteService', 'reservatieService', 'eventService', '$mdToast'];

    function SettingsController(auth, $state, ruimteService, reservatieService, eventService, $mdToast){
      var vm = this;
      vm.ruimtes = {};
      vm.events = {};
      vm.eventTypes = {};
      vm.reservaties = {};

      vm.ruimte = {};
      vm.event = {};
      vm.reservatiesday = {};
      vm.day = new Date();
      vm.time;

      vm.getReservatiesByDay = getReservatiesByDay;
      vm.getRuimtes = getRuimtes;
      vm.getReservaties = getReservaties;
      vm.getEvents = getEvents;
      vm.getEventTypes = getEventTypes;

      vm.createRuimte = createRuimte;
      vm.createEvent = createEvent;

      activate();

      function activate(){
        vm.event.publiek = false;
        vm.event.catering = false;
        getReservaties();
        getEvents();
        getEventTypes();
        return getRuimtes();
      }

      function getRuimtes(){
        vm.ruimtes = ruimteService.getAll().then(function(res){
          vm.ruimtes = res.data;
          console.log(vm.ruimtes);
          return vm.ruimtes;
        });
      }

      function getReservaties(){
        vm.reservaties = reservatieService.getAll().then(function(res){
          console.log(res.data);
          vm.reservaties = res.data;
          return vm.reservaties;
        });
      }

      function getEvents(){
        vm.events = eventService.getAll().then(function(res){
          console.log(res.data);
          console.log("in getEvents");
          vm.events = res.data;
          return vm.events;
        });
      }

      function getEventTypes(){
        vm.eventTypes = eventService.getEventTypes().then(function(res){
          console.log(res.data);
          console.log("in getEventTypes");
          vm.eventTypes = res.data;
          return vm.eventTypes;
        });

      }

      function createRuimte(){
        console.log(vm.ruimte);
        ruimteService.create(vm.ruimte);
        return vm.ruimtes.push(vm.ruimte);
      }

      function createEvent(){
        vm.event.startdate.setHours(vm.starttime.getHours());
        vm.event.startdate.setMinutes(vm.starttime.getMinutes());
        vm.event.user = auth.getCurrentUser();
        eventService.create(vm.event);
        console.log(vm.event);
        $mdToast.show($mdToast.simple()
          .content('U hebt succesvol een evenement aangemaakt.')
         .position('bottom left')
         .parent($("#toast-container"))
         .hideDelay(3000)

       );
        return vm.events.push(vm.event);
      }

      function getReservatiesByDay() {
        console.log(vm.day);
        vm.reservatiesday = reservatieService.getReservatiesByDay(vm.day).then(function (res) {
          vm.reservatiesday = res;
          console.log(res);
          console.log(vm.reservatiesday);
          return vm.reservatiesday
        });
      }
    }
})();
