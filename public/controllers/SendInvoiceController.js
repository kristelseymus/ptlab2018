(function() {

    'use strict';

    angular.module('ptlab').controller('SendInvoiceController', SendInvoiceController);

    SendInvoiceController.$inject = ['$mdPanel', 'invoice', 'reservatieService', 'mdPanelRef', '$mdToast', 'mailService'];

    function SendInvoiceController($mdPanel, invoice, reservatieService, mdPanelRef, $mdToast, mailService) {
        var vm = this;

        vm.sendInvoice = sendInvoice;
        vm.close = close;

        /* Send an invoice to the co-worker */
        function sendInvoice(){
          mailService.sendInvoiceCoworker(invoice);
          reservatieService.deleteInvoice(invoice);
          reservatieService.getAllInvoices();
          $mdToast.show($mdToast.simple()
            .content('De factuur is verzonden.')
            .position('bottom left')
            .parent($("#toast-container"))
            .hideDelay(3000));

          close();
        }

        function close() {
          mdPanelRef.close();
        };

    } // END UpdateReservatieController

})();
