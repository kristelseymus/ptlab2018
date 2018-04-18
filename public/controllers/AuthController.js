(function(){
  'use strict';

  angular.module('ptlab').controller('AuthController',AuthController);

  AuthController.$inject = ['$state','auth', '$log', '$mdToast'];

  function AuthController($state,auth,$log,$mdToast){
      var vm = this;
      vm.user = {};
      vm.users = [];
      vm.password = null;
      vm.typesUser = ['STUDENT','COWORKER','MANAGER'];

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

      function register(form){
        auth.register(vm.user).error(function(error){
          vm.error = error;
          vm.message = error;
          if(vm.message === "User already exists") {
            form.username.$error.exists = true;
          }
        }).then(function(){
          $mdToast.show($mdToast.simple()
          .content('Succesvol geregistreerd.')
          .position('bottom left')
          .parent($("#toast-container"))
          .hideDelay(3000));
          $state.go('login');
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
      function logIn(form){
        auth.logIn(vm.user)
        .error(function(error){
          vm.error = error;
          vm.message = error.message;
          if(vm.message === "Incorrect username.") {
            form.wachtwoord.$error.incorrectpassword = false;
            form.username.$error.incorrectusername = true;
          } else if(vm.message === "Incorrect password.") {
            form.username.$error.incorrectusername = false;
            form.wachtwoord.$error.incorrectpassword = true;
          }
        }).then(function(){
            $mdToast.show($mdToast.simple()
            .content("Welkom " + auth.currentUser() + " !")
            .position('bottom left')
            .parent($("#toast-container"))
            .hideDelay(3000));
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
         return vm.user.fullName;
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
