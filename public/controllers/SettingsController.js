(function(){
    'use strict';

    angular.module('ptlab').controller('SettingsController', SettingsController);

    SettingsController.$inject = ['auth', '$state', 'ruimteService'];

    function SettingsController(auth, $state, ruimteService){
      var vm = this;
    }
})();
