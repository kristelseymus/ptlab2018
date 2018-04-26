(function() {

    'use strict';

    angular.module('ptlab').controller('UpdateReservatieController', UpdateReservatieController);

    UpdateReservatieController.$inject = ['$mdPanel', 'reservatie', 'reservatieService', 'mdPanelRef', '$mdToast', 'ruimteService'];

    function UpdateReservatieController($mdPanel, reservatie, reservatieService, mdPanelRef, $mdToast, ruimteService) {
        var vm = this;

        vm.ruimtes = [];
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

        activate();

        function activate(){
          getRuimtes();
          console.log(reservatie);
          vm.updatereservatie.startdate = new Date(reservatie.startdate);
          vm.updatereservatie.keuzeDag = reservatie.keuzeDag;
          vm.updatereservatie.ruimte = reservatie.ruimte;
        }

        function close() {
          mdPanelRef.close();
        };

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
    } // EINDE UpdateReservatieController

})();
