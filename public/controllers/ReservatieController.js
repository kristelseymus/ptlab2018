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
        
        vm.reservatie.datum = getTodayDate();
        vm.ruimtes = getRuimtes();
        vm.eventTypes = getEventTypes();
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

          $mdDialog.show(confirm).then(
            function() {//OK
              return reservatieService.deleteReservatie(reservatie).then(function () {
                getReservatiesUser();
                $mdToast.show($mdToast.simple()
                .content('Reservatie geannuleerd')
                .position('top left')
                .parent($("#toast-container"))
                .hideDelay(3000));
              });
            },
            function() {//Cancel
              $mdToast.show($mdToast.simple()
              .content('Reservatie is niet geannuleerd')
              .position('top left')
              .parent($("#toast-container-alert"))
              .hideDelay(3000));
            });
      }

      function boekPlaatsStudent(){
        for(var i=0; i<vm.ruimtes.length; i++){
          if(vm.ruimtes[i].name == "Co-working Lab"){
            vm.reservatie.ruimte = vm.ruimtes[i];
            break;
          }
        }
        return  reservatieService.create(vm.reservatie)
        .error(function (err){
          vm.message = err.message;
        })
        .success(function(res){
          $mdToast.show($mdToast.simple()
          .content('U hebt succesvol een plaats gereserveerd.')
          .position('top left')
          .parent($("#toast-container"))
          .hideDelay(3000));
          $state.go("home")
        });
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
               .content('De offerte is aangevraagd.')
              .position('bottom left')
              .parent($("#toast-container"))
              .hideDelay(3000)
             );

             //Wat te doen met offertes ? Doorsturen via email of
             //opslaan in db en weergeven in settings en laten omzetten in een event door een admin.


             //$state.go('home');
           } else {
             $mdToast.show($mdToast.simple()
               .content('U kan geen evenement organiseren op deze dag.')
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
        return reservatieService.create(vm.offerte)
        .error(function (err){
          vm.message = err.message;
        })
        .success(function(res){
          $mdToast.show($mdToast.simple()
          .content('U hebt succesvol een plaats gereserveerd.')
          .position('top left')
          .parent($("#toast-container"))
          .hideDelay(3000));
          $state.go("home");
          //Er zal hier ook een mail gestuurd moeten worden voor bevestiging.
        });

      } // EINDE probeerGratis

      function factureer() {
        //Factuur aanmaken en verzenden naar het email adres van de gebruiker.
        //Daarna zal ook een reservatie moeten worden aangemaakt.
        console.log("vraagofferteaancoworker");
        console.log(vm.offerte);
        return reservatieService.create(vm.offerte)
        .error(function (err){
          vm.message = err.message;
        })
        .success(function(res){
          $mdToast.show($mdToast.simple()
          .content('U hebt succesvol een plaats gereserveerd.')
          .position('top left')
          .parent($("#toast-container"))
          .hideDelay(3000));
          $state.go("home");
          reservatieService.sendMail(vm.offerte).then(function(res){
            console.log(res);
          });
        });
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
