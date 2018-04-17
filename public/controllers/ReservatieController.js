(function() {

    'use strict';

    angular.module('ptlab').controller('ReservatieController', ReservatieController);

    ReservatieController.$inject = ['$log', 'reservatieService', 'ruimteService', 'eventService', 'mailService', 'auth', '$state', '$stateParams', '$mdToast', '$timeout', '$mdDialog'];

    function ReservatieController($log, reservatieService, ruimteService, eventService, mailService, auth, $state, $stateParams, $mdToast, $timeout, $mdDialog) {
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

      vm.factuur = {};
      vm.factuur.user = {};

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
      vm.adjustPrice = adjustPrice;

      vm.boekPlaatsStudent = boekPlaatsStudent;
      vm.vraagOfferteAan = vraagOfferteAan;
      vm.probeerGratis = probeerGratis;
      vm.factureer = factureer;

      activate();

      function activate(){
        vm.currentUser = auth.getCurrentUser();
        vm.reservatie.user = vm.currentUser;
        vm.offerte.user = vm.currentUser;
        vm.factuur.user = vm.currentUser;

        vm.minDate = new Date(vm.todayDate);
        vm.minDate.setDate(vm.todayDate.getDate()+5);
        vm.maxDate =  new Date(
          vm.todayDate.getFullYear(),
          vm.todayDate.getMonth() + 3,
          vm.todayDate.getDate()
        );

        vm.ruimtes = getRuimtes();
        vm.eventTypes = getEventTypes();
        if(vm.reservatie.user != null){
          vm.disabled = true;
        }
        getReservatiesUser();

        return vm.reservatie;
      }// EINDE activate

      function getTodayDate(){
        return new Date();
      }// EINDE getTodayDate

      function getRuimtes(){
        vm.ruimtes = ruimteService.getAll().then(function(res){
          vm.ruimtes = res.data;
          return vm.ruimtes;
        });
      }// EINDE getRuimtes

      function isGratis() {
          if(vm.reservaties.length === 0){
            //Geen reservaties voor deze coworker. Hij/zij kan dus nog eens gratis proberen
            return true;
          } else {
            //Coworker heeft wel al minimum 1 reservatie, dus hij/zij zal een offerte moeten aanmaken
            return false;
          }
      }// EINDE isGratis

      function getEventTypes(){
        vm.eventTypes = eventService.getEventTypes().then(function(res){
          vm.eventTypes = res.data;
          return vm.eventTypes;
        });
      }// EINDE getEventTypes

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
      }// EINDE getReservatiesUser

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

                mailService.sendCancellationReservation(reservatie);

                $mdToast.show($mdToast.simple()
                .content('Reservatie geannuleerd')
                .position('bottom left')
                .parent($("#toast-container"))
                .hideDelay(3000));
              });
            },
            function() {//Cancel
              $mdToast.show($mdToast.simple()
              .content('Reservatie is niet geannuleerd')
              .position('bottom left')
              .parent($("#toast-container-alert"))
              .hideDelay(3000));
            });
      }// EINDE deleteReservatie

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
          vm.reservatie.metfactuur = false;
          mailService.sendConfirmationReservation(vm.reservatie);

          $mdToast.show($mdToast.simple()
          .content('U hebt succesvol een plaats gereserveerd.')
          .position('bottom left')
          .parent($("#toast-container"))
          .hideDelay(3000));
          $state.go("home")
        });
      }// EINDE boekPlaatsStudent

      function vraagOfferteAan(){
        vm.offerte.startdate.setHours(vm.startTime.getHours());
        vm.offerte.startdate.setMinutes(vm.startTime.getMinutes());

        var enddate = new Date(vm.offerte.startdate);
        enddate.setHours(vm.endtime.getHours());
        enddate.setMinutes(vm.endtime.getMinutes());
        var tempdate;

        if(vm.offerte.startdate.getHours() >= 12){
          vm.offerte.keuzeDag = "namiddag";
        } else {
          tempdate = new Date(vm.offerte.startdate)
          tempdate.setMinutes(tempdate.getMinutes() + vm.offerte.duur);
          if(tempdate.getHours() > 12){
            vm.offerte.keuzeDag = "volledigedag";
          } else {
            if (tempdate.getHours() === 12){
              if(tempdate.getMinutes() === 0){
                vm.offerte.keuzeDag = "voormiddag";
              } else {
                vm.offerte.keuzeDag = "volledigedag";
              }
            } else {
              vm.offerte.keuzeDag = "voormiddag";
            }
          }
        }
        vm.offerte.duur = (enddate - vm.offerte.startdate)/(1000*60);
        vm.offerte.user = auth.getCurrentUser();

        reservatieService.getReservatiesByDay(vm.offerte.startdate).then(function(res){
          if(res.length === 0) { //Geen reservaties
            vm.message = "";

            mailService.sendConfirmationOffer(vm.offerte);
            mailService.sendOfferMail(vm.offerte);

            $mdToast.show($mdToast.simple()
              .content('De offerte is aangevraagd.')
              .position('bottom left')
              .parent($("#toast-container"))
              .hideDelay(3000)
             );
             $state.go('home');
           } else {
             vm.message = "U kan geen evenement organiseren op de gekozen dag."
           }
         });
      }// EINDE vraagOfferteAan

      function probeerGratis(){
        for(var i=0; i<vm.ruimtes.length; i++){
          if(vm.ruimtes[i].name == "Co-working Lab"){
            vm.reservatie.ruimte = vm.ruimtes[i];
            break;
          }
        }
        return reservatieService.create(vm.reservatie)
        .error(function (err){
          vm.message = err.message;
        })
        .success(function(res){
          mailService.sendConfirmationReservation(vm.reservatie);

          $mdToast.show($mdToast.simple()
          .content('U hebt succesvol een plaats gereserveerd.')
          .position('bottom left')
          .parent($("#toast-container"))
          .hideDelay(3000));
          $state.go("home");
        });

      } // EINDE probeerGratis

      function factureer() {
        //Factuur aanmaken en verzenden naar het email adres van de gebruiker.
        //Daarna zal ook een reservatie moeten worden aangemaakt.
        for(var i=0; i<vm.ruimtes.length; i++){
          if(vm.ruimtes[i].name == "Co-working Lab"){
            vm.factuur.ruimte = vm.ruimtes[i];
            break;
          }
        }

        return reservatieService.create(vm.factuur)
        .error(function (err){
          vm.message = err.message;
        })
        .success(function(res){
          vm.factuur.metfactuur = true;
          mailService.sendConfirmationReservation(vm.factuur);
          mailService.sendInvoiceCoworker(vm.factuur);

          $mdToast.show($mdToast.simple()
          .content('U hebt succesvol een plaats gereserveerd.')
          .position('bottom left')
          .parent($("#toast-container"))
          .hideDelay(3000));
          $state.go("home");
        });
      }// EINDE factureer

      function adjustPrice() {
        if(vm.factuur.keuzeDag == "volledigedag"){
          vm.factuur.price = 30;
        } else {
          vm.factuur.price = 15;
        }
      }// EINDE adjustPrice

    }

})();
