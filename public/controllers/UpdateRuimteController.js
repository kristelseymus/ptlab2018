(function() {

    'use strict';

    angular.module('ptlab').controller('UpdateRuimteController', UpdateRuimteController);

    UpdateRuimteController.$inject = ['$mdPanel', 'ruimte', 'ruimteService', 'mdPanelRef', '$mdToast'];

    function UpdateRuimteController($mdPanel, ruimte, ruimteService, mdPanelRef, $mdToast) {
        var vm = this;
        vm.update = update;
        vm.close = close;

        function close() {
          mdPanelRef.close();
        };

        function update() {
          console.log(ruimte);
          console.log("update");
          ruimteService.update(ruimte._id, ruimte)
            .success(function(data){
              $mdToast.show($mdToast.simple()
              .content('De ruimte is succesvol aangepast.')
              .position('bottom left')
              .parent($("#toast-container"))
              .hideDelay(3000));
              close();
            })
            .error(function(err){
              vm.message = "Er is een fout opgetreden. Probeer opnieuw."
            });
        }
    } // EINDE UpdateRuimteController

})();
