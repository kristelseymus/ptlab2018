(function(){
    'use strict';

    angular.module('ptlab').controller('NavController', NavController);

    NavController.$inject = ['auth', '$state', '$mdToast'];

    function NavController(auth, $state, $mdToast){
      var vm = this;

      vm.isOpen = false;
      vm.users = [];

      vm.isLoggedIn = auth.isLoggedIn;
      vm.isAdmin = auth.isAdmin;
      vm.currentUser = auth.currentUser;
      vm.logOut = logOut;

      function logOut() {
        auth.logOut();
        $mdToast.show($mdToast.simple()
        .content("U bent succesvol uitgelogd")
        .position('bottom left')
        .parent($("#toast-container"))
        .hideDelay(3000));
        $state.go('login');
      }

    } // END NavController
})();
