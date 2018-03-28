(function() {

    'use strict';

    angular.module('ptlab').controller('ReservatieController', ReservatieController);

    ReservatieController.$inject = ['$log', 'reservatieService', 'ruimteService', 'eventService', 'auth', '$state', '$stateParams', '$mdToast', '$timeout', '$mdDialog'];

    function ReservatieController($log, reservatieService, ruimteService, eventService, auth, $state, $stateParams, $mdToast, $timeout, $mdDialog) {
      var vm = this;

      vm.startTime = 0;
      vm.keuzeDag = {};
      vm.todayDate = new Date();
      vm.minDate = null;
      vm.maxDate = null;
      vm.weekendDisable = function(date) {
        var temp = new Date(date);
        var day = temp.getDay();
        return day === 0 || day === 6;
      };
      vm.availablePlaces;
      vm.disabled = false;

      vm.reservatie = {};
      vm.reservatie.user = {};

      vm.offerte = {};
      vm.offerte.user = {};

      vm.reservaties = {};
      vm.eventTypes = {};
      vm.currentUser = {};
      vm.ruimtes = {};
      vm.events = {};
      vm.toekomstigeReservaties = [];
      vm.keuzeDagen = [{name: "Voormiddag", value: "voormiddag"}, {name: "Namiddag", value:"namiddag"}, {name: "Volledige dag", value:"volledigedag"}];

      vm.getReservatiesUser = getReservatiesUser;
      vm.getRuimtes = getRuimtes;
      vm.getAvailablePlaces = getAvailablePlaces;
      vm.deleteReservatie = deleteReservatie;
      vm.getEventTypes = getEventTypes;
      vm.isGratis = isGratis;

      vm.boekPlaatsStudent = boekPlaatsStudent;
      vm.vraagOfferteAan = vraagOfferteAan;
      vm.probeerGratis = probeerGratis;
      vm.factureer = factureer;
      vm.adjustPrice = adjustPrice;
      vm.offerte.price = 10;

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
        vm.ruimtes = getRuimtes();
        vm.eventTypes = getEventTypes();
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
          console.log(res);
          console.log(allereservaties);
          console.log(res.length);
          if(!allereservaties.length > 0){
            console.log("Geen reservaties op de gekozen datum");
            return vm.availablePlaces = vm.reservatie.ruimte.aantalPlaatsen;
          } else {
            allereservaties.forEach(function(reserv){
              console.log(reserv);
              if(reserv.ruimte._id === vm.reservatie.ruimte._id){
                reservaties.push(reserv);
              }
            });
          }
          console.log(reservaties);
          if(!reservaties.length > 0){
            console.log("Vandaag zijn er geen reservaties in de gekozen ruimte");
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
          console.log("Einde get available places: " + vm.availablePlaces);
          return vm.availablePlaces;
        });
      }

      function getTodayDate(){
        return new Date();
      }

      function getRuimtes(){
        vm.ruimtes = ruimteService.getAll().then(function(res){
          vm.ruimtes = res.data;
          for(var i=0; i<vm.ruimtes.length; i++){
            if(vm.ruimtes[i].name == "Co-working Lab"){
              vm.offerte.ruimte = vm.ruimtes[i];
              break;
            }
          }
          return vm.ruimtes;
        });
      }

      function isGratis() {
          if(vm.reservaties.length === 0){
            //Geen reservaties voor deze coworker. Hij/zij kan dus nog eens gratis proberen
            return true;
          } else {
            //Coworker heeft wel al minimum 1 reservatie, dus hij/zij zal een offerte moeten aanmaken
            return false;
          }
      }

      function getEventTypes(){
        vm.eventTypes = eventService.getEventTypes().then(function(res){
          console.log(res.data);
          console.log("in getEventTypes");
          vm.eventTypes = res.data;
          return vm.eventTypes;
        });

      }

      function getReservatiesUser(){
        vm.reservaties = reservatieService.getReservatiesUser(vm.currentUser._id).then(function(res){
          vm.reservaties = res;
          vm.toekomstigeReservaties = []; //Clear array, bug reservaties.
          vm.reservaties.forEach(function(r){
            var today = new Date();
            var rDate = new Date(r.startdate);
            today.setHours(0,0,0,0);
            if(rDate >= today){
              vm.toekomstigeReservaties.push(r);
            }
          });
          return vm.reservaties;
        });
      }

      function deleteReservatie(reservatie){
        var confirm = $mdDialog.confirm()
          .title('Annuleer reservatie')
          .textContent('Bent u zeker dat u de reservatie wilt annuleren ?')
          .ariaLabel('Confirm deleteReservatie')
          .ok('Annuleer reservatie')
          .cancel('Cancel');

        $mdDialog.show(confirm).then(function() {
          //OK
          return reservatieService.deleteReservatie(reservatie).then(function () {
                  getReservatiesUser();
                  $mdToast.show($mdToast.simple()
                    .content('Reservatie geannuleerd')
                   .position('bottom left')
                   .parent($("#toast-container"))
                   .hideDelay(3000)
                  );
          });
        }, function() {
          //Cancel
          $mdToast.show($mdToast.simple()
            .content('Reservatie is niet geannuleerd')
           .position('bottom left')
           .parent($("#toast-container-alert"))
           .hideDelay(3000)
          );
        });
      }

      function boekPlaatsStudent(){
        for(var i=0; i<vm.ruimtes.length; i++){
          if(vm.ruimtes[i].name == "Co-working Lab"){
            vm.reservatie.ruimte = vm.ruimtes[i];
            break;
          }
        }
        return  reservatieService.create(vm.reservatie).success(function (data) {
          $mdToast.show($mdToast.simple()
            .content('U hebt succesvol een plaats gereserveerd.')
           .position('bottom left')
           .parent($("#toast-container"))
           .hideDelay(3000)

         );
          $state.go("home")
        }).error(function(error){
          var jsonerror = JSON.stringify(error);
          console.log(jsonerror)
          $mdToast.show($mdToast.simple()
            .content(error.error)
           .position('bottom left')
           .parent($("#toast-container-alert"))
           .hideDelay(3000)

         );
          vm.message = error.error;
        });
        /*
        getAvailablePlaces();
        console.log(vm.availablePlaces);
        //Checken of een student al een reservatie heeft op deze dag.
        var hasreservation = false;
        var tempvar = false;
        reservatieService.getReservatiesByDay(vm.reservatie.startdate).then(function(res){
          console.log("getReservatiesByDay");
          for(var i=0; i<res.length; i++){
            if(vm.reservatie.user._id === res[i].user._id){
              console.log('gelijk');
              hasreservation = true;
            }
          }
          if(hasreservation){
            console.log("hasreservation");
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
              vm.events = res;
              if(vm.events.length === 0){ //Er vindt geen event plaats
                if(!vm.availablePlaces > 0){ //Er is geen plaats meer
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
              } else { //Er vindt minimum 1 event plaats
                console.log("zit in events");
                console.log(vm.events);
                for(var i=0; i<vm.events.length; i++) {
                  console.log("Zit in for")
                  console.log(vm.events[i]);
                  if(vm.events[i].keuzeDag === vm.reservatie.keuzeDag || vm.events[i].keuzeDag === 'volledigedag'){ // Vind event plaats op bepaald deel dag.
                    $mdToast.show($mdToast.simple()
                      .content('Er vindt een evenement plaats op het gekozen moment.')
                     .position('bottom left')
                     .parent($("#toast-container-alert"))
                     .hideDelay(3000)
                    );
                    console.log("gelijk");
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
        });*/

        //message toevoegen
      }

      function vraagOfferteAan(){
        vm.offerte.startdate.setHours(vm.startTime.getHours());
        vm.offerte.startdate.setMinutes(vm.startTime.getMinutes());
        //if(vm.startTime.getHours() >= 12){
        //  vm.offerte.keuzeDag = "namiddag";
        //} else if(vm.duration)
        console.log('vraagOfferteAan called');
        console.log(vm.offerte);
        if(vm.offerte.aantalpersonen > vm.offerte.ruimte.aantalPlaatsen){
          $mdToast.show($mdToast.simple()
            .content('Het maximum aantal personen in de '+ vm.offerte.ruimte.name +' is '+ vm.offerte.ruimte.aantalPlaatsen +' personen')
           .position('bottom left')
           .parent($("#toast-container-alert"))
           .hideDelay(3000)
          );
       } else {
         reservatieService.getReservatiesByDay(vm.offerte.startdate).then(function(res){
           console.log(res);
           if(res.length === 0) { //Geen reservaties
             $mdToast.show($mdToast.simple()
               .content('De offerte is aangevraagd')
              .position('bottom left')
              .parent($("#toast-container"))
              .hideDelay(3000)
             );

             //Wat te doen met offertes ? Doorsturen via email of
             //opslaan in db en weergeven in settings en laten omzetten in een event door een admin.


             //$state.go('home');
           } else {
             $mdToast.show($mdToast.simple()
               .content('Er is geen plaats op de gekozen dag.')
              .position('bottom left')
              .parent($("#toast-container-alert"))
              .hideDelay(3000)
             );
           }

         });

       }
      }

      function probeerGratis(){
        for(var i=0; i<vm.ruimtes.length; i++){
          if(vm.ruimtes[i].name == "Co-working Lab"){
            vm.reservatie.ruimte = vm.ruimtes[i];
            break;
          }
        }
        vm.getAvailablePlaces();
        console.log("probeergratis");
        console.log(vm.reservatie);
        var tempvar = false;
          //Controleer of er geen event plaatsvindt.
            vm.events = eventService.getEventsByDay(vm.reservatie.startdate).then(function(res){
              if(res.length === 0){ //Er vindt geen event plaats
                console.log("geen event");
                console.log(vm.availablePlaces);
                if(!vm.availablePlaces > 0){ //Er is geen plaats meer
                  $mdToast.show($mdToast.simple()
                    .content('Er is geen plaats meer op dit moment.')
                   .position('bottom left')
                   .parent($("#toast-container-alert"))
                   .hideDelay(3000)
                 );
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
              } else { //Er vindt minimum 1 event plaats
                console.log(vm.events);
                console.log(res);
                console.log("vind event plaats");
                for(var i=0; i<res.length; i++) {
                  if(res[i].keuzeDag === vm.reservatie.keuzeDag || res[i].keuzeDag === 'volledigedag'){
                    // Vind event plaats op gekozen deel dag, of de volledige dag.
                    $mdToast.show($mdToast.simple()
                      .content('Er vindt een evenement plaats op dit moment dan de dag.')
                     .position('bottom left')
                     .parent($("#toast-container-alert"))
                     .hideDelay(3000)
                    );
                    console.log("gelijk");
                    tempvar=true;
                    return;
                  }
                } //EINDE for

                if(!tempvar){ //Geen events overlappen
                  if(!vm.availablePlaces > 0){
                    $mdToast.show($mdToast.simple()
                      .content('Er is geen plaats meer op dit moment.')
                     .position('bottom left')
                     .parent($("#toast-container-alert"))
                     .hideDelay(3000)
                    );
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
                  } //EINDE els nog plaats
                } //EINDE if(!tempvar)
              }
            });
      } // EINDE probeerGratis

      function factureer() {
        //Factuur aanmaken en verzenden naar het email adres van de gebruiker.
        //Daarna zal ook een reservatie moeten worden aangemaakt.
        console.log("vraagofferteaancoworker");
        console.log(vm.offerte);
        reservatieService.sendMail(vm.offerte);
      }

      function adjustPrice() {
        console.log("123");
        if(vm.offerte.keuzeDag == "volledigedag"){
          vm.offerte.price = 30;
        } else {
          vm.offerte.price = 15;
        }
      }

    }

})();
