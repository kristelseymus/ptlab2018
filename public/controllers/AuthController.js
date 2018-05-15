(function(){
  'use strict';

  angular.module('ptlab').controller('AuthController',AuthController);

  AuthController.$inject = ['$state','auth', '$log', '$mdToast', '$http', '$stateParams'];

  function AuthController($state,auth,$log,$mdToast,$http,$stateParams){
      var vm = this;
      vm.user = {}; //CurrentUser
      vm.users = []; //All Users
      vm.password = null;
      vm.passwordcheck = null;
      vm.showPassword = false;
      vm.isLoading = false;
      vm.typesUser = ['STUDENT','COWORKER','MANAGER'];
      /* There are a total of 3 types of users that can make reservations/events:
          - STUDENT
          - COWORKER
          - MANAGER
       */

      vm.register = register;
      vm.logIn = logIn;
      vm.isLoggedIn = isLoggedIn;
      vm.logOut = logOut;
      vm.currentUser = currentUser;
      vm.changePassword = changePassword;
      vm.getAll = getAll;
      vm.deleteUser = deleteUser;
      vm.toggleShowPassword = toggleShowPassword;
      vm.forgot = forgot;
      vm.resetPassword = resetPassword;

      activate();

      function activate() {
          return getAll();
      }

      /* Get all users */
      function getAll() {
          return auth.getAll()
              .then(function(data) {
                  vm.users = data.data;
                  return vm.users;
              });
      }

      /* Login */
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

      /* Logout */
      function logOut(){
        auth.logOut();
        $state.go('login');
      }

      /* Register a new user */
      function register(form){
        auth.register(vm.user).error(function(error){
          vm.error = error;
          if(vm.error.message === "User already exists") {
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

      /* Set a user password */
      function setPassword(){
        return auth.setPassword({password: vm.user.password}).error(function(error){
          vm.error = error;
        }).then(function(){
          $state.go('home');
        });
      }

      /* Change a user password */
      function changePassword(form){
        vm.user = auth.getCurrentUser();
        vm.user.password = vm.password;
        vm.user.passwordcheck = vm.passwordcheck;
        console.log(vm.user);
        return auth.changePassword(vm.user)
        .error(function(error){
          vm.error = error;
          if(vm.error.message === "Passwords don't match") {
            vm.message = "Wachtwoorden komen niet overeen. Probeer opnieuw."
            //form.checkwachtwoord.$error.passwordmatch = true;
          }
        }).then(function(){
            $mdToast.show($mdToast.simple()
            .content("Uw wachtwoord is succesvol gewijzigd.")
            .position('bottom left')
            .parent($("#toast-container"))
            .hideDelay(3000));
            vm.logOut();
        });
      }

      /* Toggle showPassword */
      function toggleShowPassword() {
        vm.showPassword = !vm.showPassword;
      }

      function isLoggedIn(){
        return auth.isLoggedIn();
      }

      function currentUser(){
        vm.user = auth.currentUser();
         return vm.user.fullName;
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

      function forgot(){
        vm.isLoading = true;
        return auth.forgotPassword(vm.user).error(function(err){
          console.log(err);
          vm.message = err.message;
          vm.isLoading = false;
        })
        .then(function(){
          vm.isLoading = false;
          $mdToast.show($mdToast.simple()
          .content("Er is een e-mail verstuurd naar " + vm.user.username + " met verdere instructies.")
          .position('bottom left')
          .parent($("#toast-container-mailsent"))
          .hideDelay(4000));
          $state.go('home');
        });
      }

      function resetPassword(){
        vm.user.resetPasswordToken = $stateParams.token;
        vm.user.password = vm.password;
        vm.user.passwordcheck = vm.passwordcheck;
        console.log(vm.user);
        return auth.resetPassword(vm.user)
        .error(function(err){
          console.log(err);
          vm.error = err;

          if(vm.error.message === "Passwords don't match") {
            vm.message = "Wachtwoorden komen niet overeen. Probeer opnieuw."
          } else {
            vm.message = err.message;
          }
        }).then(function(){
            $mdToast.show($mdToast.simple()
            .content("Uw wachtwoord is succesvol gewijzigd.")
            .position('bottom left')
            .parent($("#toast-container"))
            .hideDelay(3000));
            $state.go('login');
        });
      }
  } // EINDE AuthController
})();
