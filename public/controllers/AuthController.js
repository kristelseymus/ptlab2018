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
      //vm.showDialog = showDialog;

      activate();

      function activate() {
          return getAll();
      }

    //  this._mdPanel = $mdPanel;
    //  this.disableParentScroll = false;

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
    //        LoginDialogController.prototype.closeDialog();
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

    /*   function showDialog() {
         console.log("in showDialog");
        var position = this._mdPanel.newPanelPosition()
            .absolute()
            .center();

        var config = {
          attachTo: angular.element(document.body),
          controller: LoginDialogController,
          controllerAs: 'loginPanelCtrl',
          disableParentScroll: this.disableParentScroll,
          templateUrl: '/templates/login.html',
          hasBackdrop: true,
          panelClass: 'demo-dialog-example',
          position: position,
          trapFocus: true,
          zIndex: 150,
          clickOutsideToClose: true,
          escapeToClose: true,
          focusOnOpen: true
        };

        this._mdPanel.open(config);
      };

      function LoginDialogController(mdPanelRef) {
        this._mdPanelRef = mdPanelRef;
      };


      LoginDialogController.prototype.closeDialog = function() {
        var panelRef = this._mdPanelRef;

        panelRef && panelRef.close().then(function() {
          angular.element(document.querySelector('.demo-dialog-open-button')).focus();
          panelRef.destroy();
        });
      };*/


  }
})();
