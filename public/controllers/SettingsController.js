(function(){
    'use strict';

    angular.module('ptlab').controller('SettingsController', SettingsController);

    SettingsController.$inject = ['auth', '$state', 'ruimteService', 'reservatieService'];

    function SettingsController(auth, $state, ruimteService, reservatieService){
      var vm = this;
      vm.ruimtes = {};
      vm.ruimte = {};
      vm.reservaties = {};
      vm.reservatiesday = {};
      vm.day = new Date();

      vm.getReservatiesByDay = getReservatiesByDay;
      vm.getRuimtes = getRuimtes;
      vm.getReservaties = getReservaties;
      vm.createRuimte = createRuimte;

      activate();

      function activate(){
        getReservaties();
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

      function createRuimte(){
        console.log(vm.ruimte);
        ruimteService.create(vm.ruimte);
        return vm.ruimtes.push(vm.ruimte);
      }

      function getReservatiesByDay() {
        vm.reservatiesday = reservatieService.getReservatiesByDay(vm.day).then(function (res) {
          vm.reservatiesday = res;
          console.log(res);
          console.log(vm.reservatiesday);
          return vm.reservatiesday
        });
      }
    }
})();
