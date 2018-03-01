(function(){
    'use strict';

    angular.module('ptlab').controller('NavController', NavController);

    NavController.$inject = ['auth', '$state'];

    function NavController(auth, $state){
      var vm = this;

      vm.isLoggedIn = auth.isLoggedIn;
      vm.currentUser = auth.currentUser;
      vm.isOpen = false;
      //vm.isAdmin = isAdmin;

      vm.logOut = logOut;

      function logOut() {
        auth.logOut();
        $state.go('login');
        }

    /*  function isAdmin(){
        console.log("isAdmin called");
        //var user = auth.getUserByEmail(vm.currentUser);
        console.log(user);
        return user.isAdmin;
      }
*/
    }
})();
