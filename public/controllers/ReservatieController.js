(function() {

    'use strict';

    angular.module('ptlab').controller('ReservatieController', ReservatieController);

    ReservatieController.$inject = ['$log', 'reservatieService', 'ruimteService', 'eventService', 'mailService', 'websiteService', 'auth', '$state', '$stateParams', '$mdToast', '$timeout', '$mdDialog', '$mdPanel'];

    function ReservatieController($log, reservatieService, ruimteService, eventService, mailService, websiteService, auth, $state, $stateParams, $mdToast, $timeout, $mdDialog, $mdPanel) {
      var vm = this;

      vm._mdPanel = $mdPanel;

      vm.startTime = 0;
      vm.keuzeDag = {};
      vm.todayDate = new Date();
      vm.minDate = null;
      vm.maxDate = null;

      vm.aantalBeschikbarePlaatsen = 0;

      vm.feestdagen = [];
      vm.blockeddates = [];
      vm.highlightDays = [];

      vm.disabledates = function(date) {
        var temp = new Date(date);
        var day = temp.getDay();
        var feestdag = isFeestdag(temp);
        var isblocked = isBlockedDate(temp);
        return day === 0 || day === 6 || feestdag || isblocked;
      };

      vm.disableReservatieOptions = function(reservatie) {
        var tempdate = new Date(vm.todayDate);
        var startdate = new Date(reservatie.startdate);
        tempdate.setHours(tempdate.getHours() + 48);
        if(startdate >= tempdate){
          return false;
        } else {
          return true;
        }
      }

      vm.selected = [];
      vm.limitOptions = [5, 10, 15];

      vm.options = {
        rowSelection: false,
        multiSelect: true,
        autoSelect: true,
        decapitate: false,
        boundaryLinks: true,
        limitSelect: true,
        pageSelect: true,
        label: "Pagina: "
      };

      vm.query = {
        ordermyreservaties: 'startdate',
        limit: 5,
        page: 1
      };

      vm.toggleLimitOptions = function () {
        vm.limitOptions = vm.limitOptions ? undefined : [5, 10, 15];
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
      vm.events;
      vm.eventsAfterTodayCW = [];
      vm.toekomstigeReservaties = [];
      vm.keuzeDagen = [{name: "Voormiddag", value: "voormiddag"}, {name: "Namiddag", value:"namiddag"}, {name: "Volledige dag", value:"volledigedag"}];
      vm.cateringsoorten = ["Sandwiches", "Broodjes", "Andere"];

      vm.getReservatiesUser = getReservatiesUser;
      vm.getRuimtes = getRuimtes;
      vm.deleteReservatie = deleteReservatie;
      vm.getEventTypes = getEventTypes;
      vm.isGratis = isGratis;
      vm.adjustPrice = adjustPrice;
      vm.updateReservatie = updateReservatie;
      vm.getBlockedDates = getBlockedDates;

      vm.boekPlaatsStudent = boekPlaatsStudent;
      vm.vraagOfferteAan = vraagOfferteAan;
      vm.probeerGratis = probeerGratis;
      vm.factureer = factureer;

      vm.checkTimes = checkTimes;

      vm.berekenPlaatsen = berekenPlaatsen;
      vm.berekenBeschikbarePlaatsen = berekenBeschikbarePlaatsen;

      activate();

      function activate(){
        berekenFeestdagen(vm.todayDate.getFullYear());
        berekenFeestdagen(vm.todayDate.getFullYear() + 1);
        vm.currentUser = auth.getCurrentUser();
        vm.reservatie.user = vm.currentUser;
        vm.offerte.user = vm.currentUser;

        websiteService.getAllBlockedDatesPastAndFromThisYear().then(function(res){
          res.data.forEach(function(yeardates){
            for(var i = 0; i < yeardates.blockeddates.length; i++){
              vm.highlightDays.push({
                date: yeardates.blockeddates[i],
                css: 'blockeddate-holiday',
                selectable: false,
                title: 'Gesloten'
              });
            }
          });
          for(var i = 0; i < vm.feestdagen.length; i++){
            if(vm.feestdagen[i].getDay() === 0 || vm.feestdagen[i].getDay() === 6){
              vm.highlightDays.push({
                date: vm.feestdagen[i],
                css: 'blockeddate-holiday-weekends',
                selectable: false,
                title: 'Feestdag'
              });
            } else {
              vm.highlightDays.push({
                date: vm.feestdagen[i],
                css: 'blockeddate-holiday',
                selectable: false,
                title: 'Feestdag'
              });
            }
          }
        });

        vm.ruimtes = getRuimtes();
        vm.eventTypes = getEventTypes();

        vm.minDate = new Date(vm.todayDate);
        vm.minDate.setDate(vm.todayDate.getDate()+5);
        vm.maxDate =  new Date(
          vm.todayDate.getFullYear(),
          vm.todayDate.getMonth() + 3,
          vm.todayDate.getDate()
        );

        if(vm.reservatie.user != null){
          vm.disabled = true;
        }
        getReservatiesUser();
        getBlockedDates(vm.todayDate.getFullYear());

        return vm.reservatie;
      }// EINDE activate

      function berekenFeestdagen(Y){
        //Date maken -> maanden = 0 tot 11
        var pasen; //Nodig voor andere data te berekenen
        pasen = getEasterDate(Y);
        var paasmaandag; //pasen = zondag
        paasmaandag = new Date(pasen);
        paasmaandag.setDate(paasmaandag.getDate() + 1);
        var nieuwjaar = new Date(Y, 0, 1); // Jan = 0
        var dagvandearbeid;
        dagvandearbeid = new Date(Y, 4, 1); // Mei = 4
        var olhhemelvaart; // 39 dagen na pasen
        olhhemelvaart = new Date(pasen);
        olhhemelvaart.setDate(olhhemelvaart.getDate() + 39);
        var pinksteren; // 10 dagen na OLH hemelvaart
        pinksteren = new Date(olhhemelvaart);
        pinksteren.setDate(pinksteren.getDate() + 10);
        var pinkstermaandag; //pinksteren = zondag
        pinkstermaandag = new Date(pinksteren);
        pinkstermaandag.setDate(pinkstermaandag.getDate() + 1);
        var nationalefeestdag = new Date(Y, 6, 21); // 21 Juli -> 7 wordt 6
        var olvhemelvaart = new Date(Y, 7, 15); // 15 Augustus
        var allerheiligen = new Date(Y, 10, 1); // 1 November
        var wapenstilstand = new Date(Y, 10, 11); // 11 November
        var kerstmis = new Date(Y, 11, 25); // 25 December

        vm.feestdagen.push(pasen);
        vm.feestdagen.push(paasmaandag);
        vm.feestdagen.push(nieuwjaar);
        vm.feestdagen.push(dagvandearbeid);
        vm.feestdagen.push(olhhemelvaart);
        vm.feestdagen.push(pinksteren);
        vm.feestdagen.push(pinkstermaandag);
        vm.feestdagen.push(nationalefeestdag);
        vm.feestdagen.push(olvhemelvaart);
        vm.feestdagen.push(allerheiligen);
        vm.feestdagen.push(wapenstilstand);
        vm.feestdagen.push(kerstmis);
      }

      function getEasterDate(Y) {
        var C = Math.floor(Y/100);
        var N = Y - 19*Math.floor(Y/19);
        var K = Math.floor((C - 17)/25);
        var I = C - Math.floor(C/4) - Math.floor((C - K)/3) + 19*N + 15;
        I = I - 30*Math.floor((I/30));
        I = I - Math.floor(I/28)*(1 - Math.floor(I/28)*Math.floor(29/(I + 1))*Math.floor((21 - N)/11));
        var J = Y + Math.floor(Y/4) + I + 2 - C + Math.floor(C/4);
        J = J - 7*Math.floor(J/7);
        var L = I - J;
        var M = 3 + Math.floor((L + 40)/44);
        var D = L + 28 - 31*Math.floor(M/4);
        return new Date(Y, M-1, D);
      }

      function isFeestdag(date) {
        date.setHours(0,0,0,0);
        for(var i = 0; i < vm.feestdagen.length; i++){
          if(date.getTime() === vm.feestdagen[i].getTime()){
            return true;
          }
        }
      }

      function isBlockedDate(date){
        date.setHours(0,0,0,0);
        for(var i = 0; i < vm.blockeddates.length; i++){
          var temp = new Date(vm.blockeddates[i]);
          if(temp.getTime() === date.getTime()){
            return true;
          }
        }
      }

      function getBlockedDates(year){
        websiteService.getBlockedDates(year).then(function(res){
          return vm.blockeddates = res.data.blockeddates;
        });
      }

      function getTodayDate(){
        return new Date();
      }// EINDE getTodayDate

      function getRuimtes(){
        vm.ruimtes = ruimteService.getAll().then(function(res){
          vm.ruimtes = res.data;
          for(var i=0; i<vm.ruimtes.length; i++){
            if(vm.ruimtes[i].name == "Co-working Lab"){
              vm.reservatie.ruimte = vm.ruimtes[i];
              adjustPrice();
              break;
            }
          }
          eventService.getEventsByDayInRoom(vm.todayDate, vm.reservatie.ruimte._id).then(function(response){
            vm.events = response;
            console.log(vm.events);
            var dateBefore = new Date();
            vm.events.forEach(function(evenement){
              var temp = new Date(evenement.startdate);
              temp.setHours(0,0,0,0);
              if(evenement.keuzeDag === "volledigedag"){
                vm.highlightDays.push({
                  date: evenement.startdate,
                  css: 'blockeddate-custom',
                  selectable: false,
                  title: 'Evenement'
                });
              } else if(temp.getTime() === dateBefore.getTime()){
                // 2 events on 1 day in the Co-working lab.
                vm.highlightDays.push({
                  date: evenement.startdate,
                  css: 'blockeddate-custom',
                  selectable: false,
                  title: 'Evenement'
                });
              }
              dateBefore = new Date(temp);
              vm.eventsAfterTodayCW.push(new Date(evenement.startdate));
            });
          });
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
          vm.toekomstigeReservaties = [];
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
        vm.message = "";
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
          var item = {};
          item.offerte = vm.offerte;
          item.subject = "";
          if(res.length === 0) { //Geen reservaties
            vm.message = "";
            item.subject = "Offerte " + vm.offerte.ruimte.name + " " + moment(vm.offerte.startdate).format('LL');
            mailService.sendConfirmationOffer(vm.offerte);
            mailService.sendOfferMail(item);

            $mdToast.show($mdToast.simple()
              .content('De offerte is aangevraagd.')
              .position('bottom left')
              .parent($("#toast-container"))
              .hideDelay(3000)
             );
             $state.go('home');
           } else {
             var tempres = [];
             console.log(res);
             for(var i = 0; i<res.length; i++){
               console.log(res[i]);
               if(res[i].ruimte._id === vm.offerte.ruimte._id){
                 tempres.push(res[i]);
               }
             }
             if(tempres.length > 0) {
               var confirm = $mdDialog.confirm()
                .title('Offerte aanvragen')
                .textContent('Er zijn reeds plaatsen gereserveerd. Als u de offerte bevestigd, dan zullen we kijken wat wij kunnen doen om u verder te helpen.')
                .ariaLabel('Confirm awaiting offer')
                .ok('Bevestig offerte')
                .cancel('Annuleer');

               $mdDialog.show(confirm).then(
                 function() {//OK
                   $mdToast.show($mdToast.simple()
                   .content('De offerte is aangevraagd.')
                   .position('bottom left')
                   .parent($("#toast-container"))
                   .hideDelay(3000));
                   item.subject = "Offerte " + vm.offerte.ruimte.name + " " + moment(vm.offerte.startdate).format('LL') + " in afwachting";
                   mailService.sendAwaitingOfferMail(vm.offerte);
                   mailService.sendOfferMail(item);
                   $state.go('home');
                 },
                 function() {//Cancel
                   $mdToast.show($mdToast.simple()
                   .content('De offerte is niet aangevraagd.')
                   .position('bottom left')
                   .parent($("#toast-container-alert"))
                   .hideDelay(3000));
                 });
             } else {
               vm.message = "";
               item.subject = "Offerte " + vm.offerte.ruimte.name + " " + moment(vm.offerte.startdate).format('LL');
               mailService.sendConfirmationOffer(vm.offerte);
               mailService.sendOfferMail(item);

               $mdToast.show($mdToast.simple()
                 .content('De offerte is aangevraagd.')
                 .position('bottom left')
                 .parent($("#toast-container"))
                 .hideDelay(3000)
                );
                $state.go('home');
             }
           } // EINDE else
         });
      }// EINDE vraagOfferteAan

      function probeerGratis(){
        vm.message = "";
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
        vm.message = "";
        return reservatieService.create(vm.reservatie)
        .error(function (err){
          vm.message = err.message;
        })
        .success(function(res){
          vm.reservatie.metfactuur = true;
          mailService.sendConfirmationReservation(vm.reservatie);
          mailService.sendInvoiceCoworker(vm.reservatie);

          $mdToast.show($mdToast.simple()
          .content('U hebt succesvol een plaats gereserveerd.')
          .position('bottom left')
          .parent($("#toast-container"))
          .hideDelay(3000));
          $state.go("home");
        });
      }// EINDE factureer

      function adjustPrice() {
        if(vm.reservatie.ruimte){
          if(vm.reservatie.keuzeDag == "volledigedag"){
            vm.reservatie.price = vm.reservatie.ruimte.price*2;
          } else {
            vm.reservatie.price = vm.reservatie.ruimte.price;
          }
        }
      }// EINDE adjustPrice

      function updateReservatie(reservatie){
        var position = vm._mdPanel.newPanelPosition()
          .absolute()
          .center();

        var config = {
          attachTo: angular.element(document.body),
          controller: 'UpdateReservatieController',
          controllerAs: 'ctrl',
          disableParentScroll: true,
          templateUrl: '/templates/updatereservatie.html',
          hasBackdrop: true,
          panelClass: 'update-dialog-border',
          position: position,
          trapFocus: true,
          zIndex: 80,
          clickOutsideToClose: false,
          escapeToClose: false,
          focusOnOpen: true,
          locals: {
            reservatie: reservatie
          },
        };

        vm._mdPanel.open(config);
      }// EINDE updateReservatie

      function checkTimes(form){
        if(vm.startTime > vm.endtime){
          form.starttime.$error.startgreaterend = true;
        } else {
          form.starttime.$error.startgreaterend = false;
        }
      }

      function berekenPlaatsen(){
        if(vm.reservatie.ruimte != null){
          var calc = true;
          for (var i = 0; i < vm.events.length; i++){
            var temp = new Date(vm.events[i].startdate);
            temp.setHours(0,0,0,0);
            var tempres = new Date(vm.reservatie.startdate);
            tempres.setHours(0,0,0,0);
            if(temp.getTime() === tempres.getTime()){
              if(vm.events[i].keuzeDag === "volledigedag" || vm.reservatie.keuzeDag === "volledigedag"){ vm.aantalBeschikbarePlaatsen = 0; calc = false; break;}
              else if(vm.events[i].keuzeDag === vm.reservatie.keuzeDag){ vm.aantalBeschikbarePlaatsen = 0; calc = false; break; }
            }
          }
          if(calc === true){
            reservatieService.getReservatiesByDayFromASpecificRoom(vm.reservatie.startdate, vm.reservatie.ruimte._id).then(function(res){
              vm.aantalBeschikbarePlaatsen = berekenBeschikbarePlaatsen(vm.reservatie.ruimte, res, vm.reservatie);
            });
          }
        }
      }

      /* Bereken het aantal beschikbare plaatsen om te reserveren.
      Deze methode zal enkel gebruikt worden indien er geen events plaatsvinden op het gekozen moment.
      Er zullen 3 params moeten worden meegegeven:
       - ruimte: De gewenste ruimte (dit zal het co-working lab zijn bij reservaties door studenten en co-workers)
       - reservaties: Alle reservaties op de gekozen dag in de gekozen ruimte (de gekozen ruimte = boven vernoemde ruimte)
       - reservatie: De huidige reservatie
      */
      function berekenBeschikbarePlaatsen(ruimte, reservaties, reservatie){
        var plaatsen = 0;
        var temp = 0;
        var voor = 0;
        var na = 0;
        var vol = 0;
        if(!reservaties.length > 0){
          plaatsen = ruimte.aantalPlaatsen;
        } else {
            if(reservatie.keuzeDag === 'volledigedag'){
              reservaties.forEach(function(res){
                if(res.keuzeDag === 'voormiddag'){ voor += 1; }
                else if(res.keuzeDag === 'namiddag'){ na += 1; }
                else if(res.keuzeDag === 'volledigedag'){ vol += 1; }
              });
              if (voor > na){
                temp = vol + voor;
              } else{
                temp = vol + na;
              }
            } else {
              reservaties.forEach(function(res){
                if(reservatie.keuzeDag === res.keuzeDag || res.keuzeDag === 'volledigedag'){
                  temp += 1;
                }
              });
            }
            plaatsen = ruimte.aantalPlaatsen - temp;
        }
        return plaatsen;
      }

    } // EINDE ReservatieController

})();
