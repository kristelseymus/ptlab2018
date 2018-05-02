(function(){
  'use strict';

  angular.module('ptlab').controller('UpdateWebsiteController', UpdateWebsiteController);

  UpdateWebsiteController.$inject = ['auth', '$state', 'websiteService'];

  function UpdateWebsiteController(auth, $state, websiteService){

    vm.updateWebsite = updateWebsite;

    activate();

    function activate() {

    }

    function updateWebsite(){
      
    }

  }

})();
