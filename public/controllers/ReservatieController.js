(function() {

    'use strict';

    angular.module('ptlab').controller('ReservatieController', ReservatieController);

    ReservatieController.$inject = ['$log', 'reservatieService', 'ruimteService', 'auth', '$state', '$stateParams', '$mdToast'];

    function ReservatieController($log, reservatieService, ruimteService, auth, $state, $stateParams, $mdToast) {
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
      vm.types = {};
      vm.currentUser = {};
      vm.ruimtes = {};
      vm.getReservatiesUser = getReservatiesUser;
      vm.getRuimtes = getRuimtes;
      vm.getReservatieTypes = getReservatieTypes;
      vm.selectedRoom = {};
      vm.selectedRoom.aantalPersonen = 20;

      activate();

      function activate(){
        vm.currentUser = auth.getCurrentUser();
        vm.reservatie.user = vm.currentUser;
        vm.offerte.user = vm.currentUser;
        vm.reservatie.datum = getTodayDate();
        vm.types = getReservatieTypes();
        vm.ruimtes = getRuimtes();
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
        vm.ruimtes = ruimteService.getAll().then(function(res){
          vm.ruimtes = res.data;
          return vm.ruimtes;
        });
      }

      function getReservatieTypes(){
        vm.types = reservatieService.getReservatieTypes().then(function(res){
          vm.types = res.data;
          return vm.types;
        });
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
          $mdToast.show($mdToast.simple()
            .content('De offerte is aangevraagd')
           .position('bottom left')
           .parent($("#toast-container"))
           .hideDelay(3000)

         );
        $state.go('home');
      }

      function probeerGratis(){

      }
    }

})();
