(function() {

    'use strict';

    angular.module('ptlab').controller('ReservatieController', ReservatieController);

    ReservatieController.$inject = ['$log', 'reservatieService', 'auth', '$state', '$stateParams'];

    function ReservatieController($log, reservatieService, auth, $state, $stateParams) {
      var vm = this;

      vm.boekPlaatsStudent = boekPlaatsStudent;
      vm.vraagOfferteAan = vraagOfferteAan;
      vm.probeerGratis = probeerGratis;

      vm.disabled = false;
      vm.reservatie = {};
      vm.offerte = {};
      vm.reservatie.user = {};
      vm.offerte.user = {};
      vm.reservaties = {};
      vm.currentUser = {};
      vm.ruimtes = {};
      vm.getReservatiesUser = getReservatiesUser;
      vm.getRuimtes = getRuimtes;
      vm.selectedRoom = {};
      vm.selectedRoom.aantalPersonen = 30;

      activate();

      function activate(){
        vm.currentUser = auth.getCurrentUser();
        vm.reservatie.user = vm.currentUser;
        vm.offerte.user = vm.currentUser;
        vm.reservatie.datum = getTodayDate();
        if(vm.reservatie.user != null){
          vm.disabled = true;
        }
        getReservatiesUser();
        return vm.reservatie;
      }

      function getTodayDate(){
        return new Date();
      }

      function getRuimtes(){
        vm.ruimtes = [{name: "Coworking Lab"}, {name: "Meeting Room"}, {name: "Training Room"}, {name: "Board Room"}];
        return vm.ruimtes;
      }

      function getReservatiesUser(){
        vm.reservaties = reservatieService.getReservatiesUser(vm.currentUser._id).then(function(res){
          vm.reservaties = res;
          return vm.reservaties;
        });
      }

      function boekPlaatsStudent(){
        //var reservatieType = new ReservatieType();
        //reservatieType.name = "Student";
        //vm.reservatie.reservatieType = reservatieType;


        return  reservatieService.create(vm.reservatie).success(function (data) {
          console.log(data);
        }).error(function(error){
           console.log(error);
        }).then($state.go("home"));
        //message toevoegen
      }

      function vraagOfferteAan(){
        console.log('vraagOfferteAan called');
        console.log(vm.offerte);

      }

      function probeerGratis(){

      }
    }

})();
