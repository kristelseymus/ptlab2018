(function() {

    'use strict';

    angular.module('ptlab').controller('UpdateReservatieController', UpdateReservatieController);

    UpdateReservatieController.$inject = ['$mdPanel', 'reservatie', 'reservatieService', 'websiteService', 'mdPanelRef', '$mdToast', 'ruimteService'];

    function UpdateReservatieController($mdPanel, reservatie, reservatieService, websiteService, mdPanelRef, $mdToast, ruimteService) {
        var vm = this;

        vm.ruimtes = [];
        vm.todayDate = new Date();
        vm.feestdagen = [];
        vm.blockeddatesyear = [];

        vm.updateNonAdmin = updateNonAdmin;
        vm.updateAdmin = updateAdmin;
        vm.getRuimtes = getRuimtes;
        vm.close = close;
        vm.keuzeDagen = [{name: "Voormiddag", value: "voormiddag"}, {name: "Namiddag", value:"namiddag"}, {name: "Volledige dag", value:"volledigedag"}];
        vm.reservatieOrigineleKeuze = reservatie.keuzeDag;
        vm.reservatieOrigineleDatum = reservatie.startdate;
        vm.reservatieOrigineleRuimte = reservatie.ruimte;
        vm.nieuweKeuze;
        vm.updatereservatie = {};

        vm.printReservation = printReservation;

        vm.disabledates = function(date) {
          var temp = new Date(date);
          var day = temp.getDay();
          var feestdag = isFeestdag(temp);
          var isblocked = isBlockedDate(temp);
          return day === 0 || day === 6 || feestdag || isblocked;
        };

        activate();

        function activate(){
          getRuimtes();
          berekenFeestdagen(vm.todayDate.getFullYear());
          berekenFeestdagen(vm.todayDate.getFullYear() + 1);

          websiteService.getAllBlockedDatesPastAndFromThisYear().then(function(res){
            res.data.forEach(function(yeardates){
              for(var i = 0; i < yeardates.blockeddates.length; i++){
                vm.blockeddatesyear.push(yeardates.blockeddates[i]);
              }
            });
          });

          vm.updatereservatie.startdate = new Date(reservatie.startdate);
          vm.updatereservatie.keuzeDag = reservatie.keuzeDag;
          for(var i = 0; i < vm.ruimtes; i++){
            if(vm.ruimtes[i]._id === reservatie.ruimte._id){
              vm.updatereservatie.ruimte = vm.ruimtes[i];
            }
          }
          //vm.updatereservatie.ruimte = reservatie.ruimte;
        }

        function close() {
          mdPanelRef.close();
        };

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
          for(var i = 0; i < vm.blockeddatesyear.length; i++){
            var temp = new Date(vm.blockeddatesyear[i]);
            if(temp.getTime() === date.getTime()){
              return true;
            }
          }
        }

        function updateNonAdmin() {
          reservatie.keuzeDag = vm.nieuweKeuze;
          console.log(reservatie);
          console.log("update");
          reservatieService.update(reservatie._id, reservatie)
            .success(function(data){
              $mdToast.show($mdToast.simple()
              .content('De reservatie is succesvol aangepast.')
              .position('bottom left')
              .parent($("#toast-container"))
              .hideDelay(3000));
              close();
            })
            .error(function(err){
              reservatie.keuzeDag = vm.reservatieOrigineleKeuze;
              vm.message = err.message;
            });
        }

        function updateAdmin() {
          console.log(vm.updatereservatie);
          reservatie.keuzeDag = vm.updatereservatie.keuzeDag;
          reservatie.startdate = vm.updatereservatie.startdate;
          reservatie.ruimte = vm.updatereservatie.ruimte;
          console.log(reservatie);
          console.log("update");
          reservatieService.update(reservatie._id, reservatie)
            .success(function(data){
              $mdToast.show($mdToast.simple()
              .content('De reservatie is succesvol aangepast.')
              .position('bottom left')
              .parent($("#toast-container"))
              .hideDelay(3000));
              close();
            })
            .error(function(err){
              reservatie.keuzeDag = vm.reservatieOrigineleKeuze;
              reservatie.startdate = vm.reservatieOrigineleDatum;
              reservatie.ruimte = vm.reservatieOrigineleRuimte;
              console.log(err);
              vm.message = err.message;
            });
        }

        function getRuimtes(){
          ruimteService.getAll().then(function(res){
            vm.ruimtes = res.data;
            return vm.ruimtes;
          });
        }

        function printReservation(){
          console.log(vm.updatereservatie);
          console.log(reservatie);
        }
    } // EINDE UpdateReservatieController

})();
