(function(){
    'use strict';

    angular.module('ptlab').controller('SettingsController', SettingsController);

    SettingsController.$inject = ['auth', '$state'];

    function SettingsController(auth, $state){
      var vm = this;
    }
})();
