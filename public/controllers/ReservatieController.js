(function() {

    'use strict';

    angular.module('ptlab').controller('ReservatieController', ReservatieController);

    ReservatieController.$inject = ['$log', 'reservatieService', 'ruimteService', 'auth', '$state', '$stateParams', '$mdToast'];

    function ReservatieController($log, reservatieService, ruimteService, auth, $state, $stateParams, $mdToast) {
      var vm = this;

      vm.boekPlaatsStudent = boekPlaatsStudent;
      vm.vraagOfferteAan = vraagOfferteAan;
      vm.probeerGratis = probeerGratis;
      vm.startTime = 0;
      vm.keuzeDag = {};
      vm.todayDate = new Date();
      vm.minDate = null;
      vm.maxDate = null;
      vm.weekendDisable = function(date) {
        var day = date.getDay();
        return day === 1 || day === 2 || day === 3 || day === 4 || day === 5;
      };
      vm.availablePlaces = 20;


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
      vm.getAvailablePlaces = getAvailablePlaces;
      vm.selectedRoom = {};
      vm.availableRooms = {};
      vm.selectedRoom.aantalPersonen = 20;

      activate();

      function activate(){
        vm.currentUser = auth.getCurrentUser();
        vm.reservatie.user = vm.currentUser;
        vm.offerte.user = vm.currentUser;
        vm.minDate = new Date(vm.todayDate);
        vm.minDate.setDate(vm.todayDate.getDate()+5);
        vm.maxDate =  new Date(
          vm.todayDate.getFullYear(),
          vm.todayDate.getMonth() + 3,
          vm.todayDate.getDate()
        );
        vm.availablePlaces = 0;
        vm.reservatie.datum = getTodayDate();
        vm.types = getReservatieTypes();
        vm.ruimtes = getRuimtes();
        vm.availableRooms = getAvailableRooms();
        if(vm.reservatie.user != null){
          vm.disabled = true;
        }
        getReservatiesUser();

        return vm.reservatie;
      }

      function getAvailablePlaces(){
        reservatieService.getReservatiesByDay(vm.reservatie.startdate).then(function(res){
          var reservaties = res;
          console.log(reservaties);
          vm.availablePlaces = vm.selectedRoom.aantalPersonen - reservaties.length;
          return vm.availablePlaces;
        });;
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

      function getAvailableRooms(){
        /*vm.availableRooms = ruimteService.getAvailableRooms().then(function(res){
          vm.availableRooms = res.data;
          return vm.availableRooms;
        });*/
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

        if(!vm.availablePlaces > 0){
          vm.message = "Er is geen plaats meer op dit moment."
          return;
        }
        return  reservatieService.create(vm.reservatie).success(function (data) {
          console.log(data);
          $mdToast.show($mdToast.simple()
            .content('U hebt succesvol een plaats gereserveerd.')
           .position('bottom left')
           .parent($("#toast-container"))
           .hideDelay(3000)

         );
          $state.go("home")
        }).error(function(error){
          vm.message = error.message;
           console.log(error);
        });
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
