(function() {

    'use strict';

    angular.module('ptlab').controller('ContactController', ContactController);

    ContactController.$inject = ['$log', 'auth', '$state', '$stateParams', 'mailService', '$mdToast'];

    function ContactController($log, auth, $state, $stateParams, mailService, $mdToast) {
        var vm = this;

        vm.contact = {};
        vm.submitForm = submitForm;

        function submitForm(){
          mailService.sendContactMail(vm.contact);
          $mdToast.show($mdToast.simple()
          .content('Bericht verzonden.')
          .position('bottom left')
          .parent($("#toast-container"))
          .hideDelay(3000));
          $state.go("home");
        }
    } // END ContactController

})();
