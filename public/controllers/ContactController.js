(function() {

    'use strict';

    angular.module('ptlab').controller('ContactController', ContactController);

    ContactController.$inject = ['$log', 'auth', '$state', '$stateParams'];

    function ContactController($log, auth, $state, $stateParams) {
        var vm = this;
    }

})();
