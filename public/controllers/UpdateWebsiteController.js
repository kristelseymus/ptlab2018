(function(){
  'use strict';

  angular.module('ptlab').controller('UpdateWebsiteController', UpdateWebsiteController);

  UpdateWebsiteController.$inject = ['auth', '$state', 'websiteService', '$mdToast'];

  function UpdateWebsiteController(auth, $state, websiteService, $mdToast){
    var vm = this;
    vm.updateWebsite = updateWebsite;
    //vm.postWebsite = postWebsite;
    vm.content = {};
    vm.content.openingsuren = [];
    vm.maandag = {};
    vm.dinsdag = {};
    vm.woensdag = {};
    vm.donderdag = {};
    vm.vrijdag = {};

    activate();

    function activate() {

      getContent();
    }

    /* Update the content of the website */
    function updateWebsite(){
      vm.content.openingsuren[0].openingsuur = vm.maandag.openingsuur.getHours()*60 + vm.maandag.openingsuur.getMinutes();
      vm.content.openingsuren[0].sluitingsuur = vm.maandag.sluitingsuur.getHours()*60 + vm.maandag.sluitingsuur.getMinutes();
      vm.content.openingsuren[1].openingsuur = vm.dinsdag.openingsuur.getHours()*60 + vm.dinsdag.openingsuur.getMinutes();
      vm.content.openingsuren[1].sluitingsuur = vm.dinsdag.sluitingsuur.getHours()*60 + vm.dinsdag.sluitingsuur.getMinutes();
      vm.content.openingsuren[2].openingsuur = vm.woensdag.openingsuur.getHours()*60 + vm.woensdag.openingsuur.getMinutes();
      vm.content.openingsuren[2].sluitingsuur = vm.woensdag.sluitingsuur.getHours()*60 + vm.woensdag.sluitingsuur.getMinutes();
      vm.content.openingsuren[3].openingsuur = vm.donderdag.openingsuur.getHours()*60 + vm.donderdag.openingsuur.getMinutes();
      vm.content.openingsuren[3].sluitingsuur = vm.donderdag.sluitingsuur.getHours()*60 + vm.donderdag.sluitingsuur.getMinutes();
      vm.content.openingsuren[4].openingsuur = vm.vrijdag.openingsuur.getHours()*60 + vm.vrijdag.openingsuur.getMinutes();
      vm.content.openingsuren[4].sluitingsuur = vm.vrijdag.sluitingsuur.getHours()*60 + vm.vrijdag.sluitingsuur.getMinutes();

      websiteService.updateContent(vm.content);
      $mdToast.show($mdToast.simple()
        .content('De website is succesvol geüpdatet.')
       .position('bottom left')
       .parent($("#toast-container"))
       .hideDelay(3000));
    }

    /* Get the content of the website */
    function getContent(){
      websiteService.getContent().then(function(res){
        vm.content = res.data;
        vm.maandag.openingsuur = new Date();
        vm.maandag.sluitingsuur = new Date();
        vm.maandag.openingsuur.setHours(0,0,0,0);
        vm.maandag.sluitingsuur.setHours(0,0,0,0);
        vm.dinsdag.openingsuur = new Date();
        vm.dinsdag.sluitingsuur = new Date();
        vm.dinsdag.openingsuur.setHours(0,0,0,0);
        vm.dinsdag.sluitingsuur.setHours(0,0,0,0);
        vm.woensdag.openingsuur = new Date();
        vm.woensdag.sluitingsuur = new Date();
        vm.woensdag.openingsuur.setHours(0,0,0,0);
        vm.woensdag.sluitingsuur.setHours(0,0,0,0);
        vm.donderdag.openingsuur = new Date();
        vm.donderdag.sluitingsuur = new Date();
        vm.donderdag.openingsuur.setHours(0,0,0,0);
        vm.donderdag.sluitingsuur.setHours(0,0,0,0);
        vm.vrijdag.openingsuur = new Date();
        vm.vrijdag.sluitingsuur = new Date();
        vm.vrijdag.openingsuur.setHours(0,0,0,0);
        vm.vrijdag.sluitingsuur.setHours(0,0,0,0);
        vm.maandag.openingsuur.setMinutes(vm.content.openingsuren[0].openingsuur);
        vm.maandag.sluitingsuur.setMinutes(vm.content.openingsuren[0].sluitingsuur);
        vm.dinsdag.openingsuur.setMinutes(vm.content.openingsuren[1].openingsuur);
        vm.dinsdag.sluitingsuur.setMinutes(vm.content.openingsuren[1].sluitingsuur);
        vm.woensdag.openingsuur.setMinutes(vm.content.openingsuren[2].openingsuur);
        vm.woensdag.sluitingsuur.setMinutes(vm.content.openingsuren[2].sluitingsuur);
        vm.donderdag.openingsuur.setMinutes(vm.content.openingsuren[3].openingsuur);
        vm.donderdag.sluitingsuur.setMinutes(vm.content.openingsuren[3].sluitingsuur);
        vm.vrijdag.openingsuur.setMinutes(vm.content.openingsuren[4].openingsuur);
        vm.vrijdag.sluitingsuur.setMinutes(vm.content.openingsuren[4].sluitingsuur);
      });
    }

    /* Add a website content to the database (only if there doesn't exist one) */
    /*function postWebsite(){
      vm.content.openingsuren.push(vm.maandag);
      vm.content.openingsuren.push(vm.dinsdag);
      vm.content.openingsuren.push(vm.woensdag);
      vm.content.openingsuren.push(vm.donderdag);
      vm.content.openingsuren.push(vm.vrijdag);
      websiteService.postWebsite(vm.content);
    }*/

  } // END UpdateWebsiteController

})();
