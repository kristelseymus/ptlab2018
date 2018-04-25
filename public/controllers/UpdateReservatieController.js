(function() {

    'use strict';

    angular.module('ptlab').controller('UpdateReservatieController', UpdateReservatieController);

    UpdateReservatieController.$inject = ['$mdPanel', 'reservatie', 'reservatieService', 'mdPanelRef', '$mdToast'];

    function UpdateReservatieController($mdPanel, reservatie, reservatieService, mdPanelRef, $mdToast) {
        var vm = this;
        vm.updateNonAdmin = updateNonAdmin;
        vm.close = close;
        vm.keuzeDagen = [{name: "Voormiddag", value: "voormiddag"}, {name: "Namiddag", value:"namiddag"}, {name: "Volledige dag", value:"volledigedag"}];
        vm.reservatieOrigineleKeuze = reservatie.keuzeDag;

        function close() {
          reservatie.keuzeDag = vm.reservatieOrigineleKeuze;
          mdPanelRef.close();
        };

        function updateNonAdmin() {
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
              vm.message = err;
            });
        }
    } // EINDE UpdateRuimteController

})();
