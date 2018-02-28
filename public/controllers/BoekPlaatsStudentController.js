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
