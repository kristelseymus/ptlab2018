(function() {

    'use strict';

    angular.module('ptlab').controller('BoekPlaatsStudentController', BoekPlaatsStudentController);

    BoekPlaatsStudentController.$inject = ['$log', 'auth', '$state', '$stateParams'];

    function BoekPlaatsStudentController($log, auth, $state, $stateParams) {
      var vm = this;
      vm.datum = getTodayDate();
      vm.isOpen = false;
      vm.student = null;
      vm.aantalPlaatsen = 20;
      vm.boekPlaatsStudent = boekPlaatsStudent;
      vm.user = {};
      vm.disabled = false;

      activate();

      function activate(){
        vm.user = auth.getCurrentUser();
        if(vm.user != null){
          vm.disabled = true;
        }
        return vm.user;
      }

      function getTodayDate(){
        return new Date();
      }

      function boekPlaatsStudent(){
        if(vm.datum < getTodayDate()){};
        vm.aantalPlaatsen = 15;
        return vm.student;
      }
    }

})();
