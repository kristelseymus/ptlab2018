(function(){
    'use strict';

    angular.module('ptlab').controller('NavController', NavController);

    NavController.$inject = ['auth', '$state'];

    function NavController(auth, $state){
      var vm = this;

      vm.isLoggedIn = auth.isLoggedIn;
      vm.currentUser = auth.currentUser;
      vm.isOpen = false;

      vm.logOut = logOut;

      function logOut() {
        auth.logOut();
        $state.go('login');
        }

    }
})();
