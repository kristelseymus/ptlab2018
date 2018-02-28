(function(){
  'use strict';

  angular.module('ptlab').controller('AuthController',AuthController);

  AuthController.$inject = ['$state','auth', '$log'];

  function AuthController($state,auth,$log){
      var vm = this;
      vm.user = {};
      vm.users = [];
      vm.password = null;

      vm.register = register;
      vm.logIn = logIn;
      vm.isLoggedIn = isLoggedIn;
      vm.logOut = logOut;
      vm.currentUser = currentUser;
      vm.changePassword = changePassword;
      vm.getAll = getAll;
      vm.deleteUser = deleteUser;

      activate();

      function activate() {
          return getAll();
      }
      function register(){
        auth.register(vm.user).error(function(error){
          vm.error = error;
          vm.message = error.message;
        }).then(function(){
          $state.go('home');
        });
      }
      function changePassword(){
        return auth.changePassword({password: vm.user.password}).error(function(error){
          vm.error = error;
        }).then(function(){
          $state.go('home');
        });
      }
      function setPassword(){
        return auth.setPassword({password: vm.user.password}).error(function(error){
          vm.error = error;
        }).then(function(){
          $state.go('home');
        });
      }
      function logIn(){
        auth.logIn(vm.user)
        .error(function(error){
          vm.error = error;
          vm.message = error.message;
        }).then(function(){
            $state.go('home');
        });
      }
      function isLoggedIn(){
        return auth.isLoggedIn();
      }
      function logOut(){
        auth.logOut();
      }
      function currentUser(){
        vm.user = auth.currentUser();
         return vm.user.username;
      }
      function getAll() {
          return auth.getAll()
              .then(function(data) {
                  vm.users = data.data;
                  return vm.users;
              });
      }
      function deleteUser(user){

          if(user.username === auth.currentUser()){
              vm.message = "You can't delete yourself";
              return;
          }
          vm.message = null;
          return auth.deleteUser(user).then(function(){
            getAll();
          });
      }



  }
})();
