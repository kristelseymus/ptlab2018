(function() {

    'use strict';

    angular.module('ptlab').controller('ContactController', ContactController);

    ContactController.$inject = ['$log', 'auth', '$state', '$stateParams'];

    function ContactController($log, auth, $state, $stateParams) {
        var vm = this;
        vm.contact = {};
        vm.submitForm = submitForm;

        function submitForm(){
          console.log("Submit");
          console.log(vm.contact);
        }
    }

})();
