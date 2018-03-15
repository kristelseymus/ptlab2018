(function() {

    'use strict';

    angular.module('ptlab').controller('ReservatieController', ReservatieController);

    ReservatieController.$inject = ['$log', 'reservatieService', 'ruimteService', 'eventService', 'auth', '$state', '$stateParams', '$mdToast'];

    function ReservatieController($log, reservatieService, ruimteService, eventService, auth, $state, $stateParams, $mdToast) {
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
      vm.availablePlaces;


      vm.disabled = false;
      vm.reservatie = {};
      vm.offerte = {};
      vm.reservatie.user = {};
      vm.offerte.user = {};
      vm.reservaties = {};
    //  vm.types = {};
      vm.currentUser = {};
      vm.ruimtes = {};
      vm.events = {};
      vm.availableRooms = {};
      vm.getReservatiesUser = getReservatiesUser;
      vm.getRuimtes = getRuimtes;
      vm.getAvailablePlaces = getAvailablePlaces;
      vm.deleteReservatie = deleteReservatie;
    //  vm.getReservatieTypes = getReservatieTypes;

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
        vm.availablePlaces;
        vm.reservatie.datum = getTodayDate();
      //  vm.types = getReservatieTypes();
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
          var allereservaties = res;
          var reservaties = [];
          console.log(reservaties);
          var temp = 0;
          var voor = 0;
          var na = 0;
          var vol = 0;
          var reser;

          //Bij alle reservaties zal worden gekeken welke ruimte is gereserveerd.
          //Alle reservaties met dezelfde ruimte als de gewenste ruimte,
          //zullen worden toegevoegd aan de reservaties array.
          if(!res){
            return vm.availablePlaces = vm.reservatie.ruimte.aantalPlaatsen;
          } else {
            allereservaties.forEach(function(reserv){
              if(reserv.ruimte === vm.reservatie.ruimte._id){
                reservaties.push(reserv);
              }
            });
          }
          if(!reservaties){
            //Als reservaties leeg is, dan zijn er geen reservaties opgeslagen in deze ruimte op deze dag.
            vm.availablePlaces = vm.reservatie.ruimte.aantalPlaatsen;
            return vm.availablePlaces;
          }

          if(vm.reservatie.keuzeDag === 'volledigedag'){
            //Wanneer er voor een volledige dag gekozen wordt, dienen er andere controles uitgevoerd te worden.
            reservaties.forEach(function(reser){
              if(reser.keuzeDag === 'voormiddag'){ voor += 1; }
              else if(reser.keuzeDag === 'namiddag'){ na += 1; }
              else if(reser.keuzeDag === 'volledigedag'){ vol += 1; }
            });
            if (voor > na){
              //Als het aantal reservering in de voormiddag groter zijn dan het aantal in de namiddag,
              //zal het aantal van de voormiddag gebruikt worden als vermindering voor het aantal beschikbare plaatsen.
              //Dit is ook zo indien namiddag > voormiddag, dan zal namiddag gebruikt worden.

              //Het aantal beschikbare plaatsen op het gekozen moment zal dan gelijk zijn aan
              //het totaal beschikbare in de ruimte - vol (aantal volledige) - voor (of na)
              temp = vol + voor;
              console.log("Temp: voor > na" + temp);
            } else{
              //Namiddag is groter of gelijk aan voormiddag.
              temp = vol + na;
              console.log("Temp: na > voor" + temp)
            }
          } else {
             //Er werd geen volledige dag gekozen.
            reservaties.forEach(function(reser){
              if(vm.reservatie.keuzeDag === reser.keuzeDag || reser.keuzeDag === 'volledigedag'){
                temp += 1;
              }
            });
          }
          vm.availablePlaces = vm.reservatie.ruimte.aantalPlaatsen - temp;
          return vm.availablePlaces;
        });
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
/*
      function getReservatieTypes(){
        vm.types = reservatieService.getReservatieTypes().then(function(res){
          vm.types = res.data;
          return vm.types;
        });
      }*/

      function getReservatiesUser(){
        vm.reservaties = reservatieService.getReservatiesUser(vm.currentUser._id).then(function(res){
          vm.reservaties = res;
          console.log(res);
          return vm.reservaties;
        });
      }

      function deleteReservatie(reservatie){
        return reservatieService.deleteReservatie(reservatie).then(function () {
                getReservatiesUser();
        });
      }

      function boekPlaatsStudent(){
        //Checken of een student al een reservatie heeft op deze dag.
        var hasreservation = false;
        var tempvar = false;
        reservatieService.getReservatiesByDay(vm.reservatie.startdate).then(function(res){
          for(var i=0; i<res.length; i++){
            console.log(res[i]);
            if(vm.reservatie.user._id === res[i].user._id){
              console.log('gelijk');
              hasreservation = true;
            }
          }
          if(hasreservation){
            console.log('showdialog reser');
            $mdToast.show($mdToast.simple()
              .content('U hebt al een reservatie op de gekozen dag.')
             .position('bottom left')
             .parent($("#toast-container-alert"))
             .hideDelay(3000)
            );
            return;
          } else {
          //Controleer of er geen event plaatsvindt.
            vm.events = eventService.getEventsByDay(vm.reservatie.startdate).then(function(res){
              if(vm.events.length === 0){ //Er vindt geen event plaats
                if(!vm.availablePlaces > 0){
                  $mdToast.show($mdToast.simple()
                    .content('Er is geen plaats meer op dit moment.')
                   .position('bottom left')
                   .parent($("#toast-container-alert"))
                   .hideDelay(3000)
                 );
                  //vm.message = "Er is geen plaats meer op dit moment."
                  return;
                } else { //Er is wel nog een plaats
                  return  reservatieService.create(vm.reservatie).success(function (data) {
                    $mdToast.show($mdToast.simple()
                      .content('U hebt succesvol een plaats gereserveerd.')
                     .position('bottom left')
                     .parent($("#toast-container"))
                     .hideDelay(3000)

                   );
                    $state.go("home")
                  }).error(function(error){
                    vm.message = error.message;
                  });
                }
              } else {
                console.log("zit in events");
                for(var i=0; i<vm.events.length; i++) {
                  console.log("Zit in for")
                  console.log(vm.events[i]);
                  if(vm.events[i].keuzeDag === vm.reservatie.keuzeDag){ // Vind event plaats op bepaald deel dag.
                    $mdToast.show($mdToast.simple()
                      .content('Er vindt een evenement plaats op dit moment dan de dag.')
                     .position('bottom left')
                     .parent($("#toast-container-alert"))
                     .hideDelay(3000)
                    );
                    console.log("gelijk");
                    tempvar=true;
                    return;
                  } else if(vm.events[i].keuzeDag === 'volledigedag'){
                    $mdToast.show($mdToast.simple()
                      .content('Er vindt een evenement plaats op dit moment dan de dag.')
                     .position('bottom left')
                     .parent($("#toast-container-alert"))
                     .hideDelay(3000)
                    );
                    console.log("gelijk2")
                    tempvar=true;
                    return;
                  }
                }

                //Komt uit for loop, dus geen event gevonden dat op het gekozen moment plaatsvindt.
                //Nu controle of er dan nog plaats is.
                console.log("uit for loop" + tempvar);
                if(!tempvar){ //Geen events overlappen
                  if(!vm.availablePlaces > 0){
                    $mdToast.show($mdToast.simple()
                      .content('Er is geen plaats meer op dit moment.')
                     .position('bottom left')
                     .parent($("#toast-container-alert"))
                     .hideDelay(3000)

                   );
                    //vm.message = "Er is geen plaats meer op dit moment."
                    return;
                  } else { //Er is wel nog een plaats
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
                  }
                }

              }
            });

          }
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
