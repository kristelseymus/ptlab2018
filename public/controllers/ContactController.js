(function() {

    'use strict';

    angular.module('ptlab').controller('ContactController', ContactController);

    ContactController.$inject = ['$log', 'auth', '$state', '$stateParams', 'mailService'];

    function ContactController($log, auth, $state, $stateParams, mailService) {
        var vm = this;
        vm.contact = {};
        vm.submitForm = submitForm;

        function submitForm(){
          mailService.sendContactMail(vm.contact);
        }
    }

})();
