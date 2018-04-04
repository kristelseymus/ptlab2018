(function(){
    'use strict';

    angular.module('ptlab').controller('SettingsController', SettingsController);

    SettingsController.$inject = ['auth', '$state', 'ruimteService', 'reservatieService', 'eventService', '$mdToast', '$scope', '$timeout'];

    function SettingsController(auth, $state, ruimteService, reservatieService, eventService, $mdToast, $scope, $timeout){
      var vm = this;
      vm.ruimtes = {};
      vm.events = {};
      vm.eventTypes = {};
      vm.reservaties = [];

      vm.ruimte = {};
      vm.event = {};
      vm.reservatiesday = {};
      vm.day = new Date();
      vm.time;

      vm.todayDate = new Date();
      vm.minDate = null;
      vm.maxDate = null;

      vm.getReservatiesByDay = getReservatiesByDay;
      vm.getRuimtes = getRuimtes;
      vm.getReservaties = getReservaties;
      vm.getEvents = getEvents;
      vm.getEventTypes = getEventTypes;
      vm.getEndTime = getEndTime;

      vm.createRuimte = createRuimte;
      vm.createEvent = createEvent;
      vm.reload = reload;

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
        getEvents();
        getEventTypes();
        return getRuimtes();
      }

      vm.selected = [];
      vm.limitOptions = [5, 10, 15];

      vm.options = {
        rowSelection: true,
        multiSelect: true,
        autoSelect: true,
        decapitate: false,
        boundaryLinks: true,
        limitSelect: true,
        pageSelect: true,
        label: "Pagina: "
      };

      vm.query = {
        order: 'user.fullName',
        limit: 5,
        page: 1
      };

      vm.toggleLimitOptions = function () {
        vm.limitOptions = vm.limitOptions ? undefined : [5, 10, 15];
      };

      function reload(){
        vm.promise = $timeout(function () {
          getReservaties();
        }, 2000);
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
        vm.event.user = auth.getCurrentUser();
        //eventService.create(vm.event);
        console.log(vm.event);
        $mdToast.show($mdToast.simple()
          .content('U hebt succesvol een evenement aangemaakt.')
         .position('top left')
         .parent($("#toast-container"))
         .hideDelay(3000)

       );
        //return vm.events.push(vm.event);
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

      function getEndTime(ev){
        var enddate = new Date(ev.startdate);
        var startdate = new Date(ev.startdate);
        enddate.setMinutes(startdate.getMinutes() + ev.duur);
        return enddate;
      }
    }
})();
