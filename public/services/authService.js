(function() {

    'use strict';

    angular.module('ptlab').factory('auth', authService);

    authService.$inject = ['$http', '$window', '$log'];

    function authService($http, $window, $log) {
        var auth = {};
        var service = {
            saveToken: saveToken,
            getToken: getToken,
            getUser: getUser,
            isLoggedIn: isLoggedIn,
            isAdmin: isAdmin,
            currentUser: currentUser,
            register: register,
            logIn: logIn,
            logOut: logOut,
            changePassword: changePassword,
            getAll: getAll,
            getAllUsers: getAllUsers,
            deleteUser: deleteUser,
            getCurrentUser: getCurrentUser,
            forgotPassword: forgotPassword,
            resetPassword: resetPassword
        };
        return service;

        /* Get all users */
        function getAll() {
            return $http.get('/api/users').success(function(data) {
                return data;

            });
        }

        /* Get user by id */
        function getUser(id) {
            return $http.get('/api/users/' + id).success(function(data) {
                return data;
            }).error(function(err){
                return err;
            });
        }

        /* Get nonadmins */
        function getAllUsers(){
            return $http.get('/api/users/nonadmins').success(function(data) {
                return data;
            }).console.error();;
        }

        /* Save JWT token */
        function saveToken(token) {
            $window.localStorage['ptlab-app-token'] = token;
        }

        /* Get JWT token */
        function getToken() {
            return $window.localStorage['ptlab-app-token'];
        }

        /* Check if user is logged in */
        function isLoggedIn() {
            var token = getToken();
            if (token) {
                var payload = angular.fromJson($window.atob(token.split('.')[1]));
                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        }

        /* Check if user is an admin */
        function isAdmin() {
          if (isLoggedIn()) {
              var token = getToken();
              var payload = angular.fromJson($window.atob(token.split('.')[1]));
              return payload.isAdmin;
          }
        }

        /* Get the full name of the current user.
        There is information stored about the user inside the JWT token */
        function currentUser() {
            if (isLoggedIn()) {
                var token = getToken();
                var payload = angular.fromJson($window.atob(token.split('.')[1]));
                return payload.fullName;
            }
        }

        /* Create a new account */
        function register(user) {
            return $http.post('/api/users/register', user, {
                headers: {
                    Authorization: 'Bearer ' + getToken()
                }
            });
        }

        /* Login */
        function logIn(user) {
            return $http.post('/api/users/login', user, {
                headers: {
                    Authorization: 'Bearer ' + getToken()
                }
            }).success(function(data) {
                saveToken(data.token);
            }).error(function(err){
              return err;
            });
        }

        /* Logout */
        function logOut(){
            $window.localStorage.removeItem('ptlab-app-token');
        }

        /* Change the user's password */
        function changePassword(user){
          console.log(user);
          return $http.put("/api/users/changepassword",user, {
              headers: {
                  Authorization: 'Bearer ' + getToken()
              }
          }).error(function(err){
            console.log(err);
          });
        }

        /* Delete a user */
        function deleteUser(user){
            return $http.delete('/api/users/' + user._id, {
                headers: {
                    Authorization: 'Bearer ' + getToken()
                }
            }).then(function(res) {
                return res.data;
            })
        }

        /* Get the current user in an object.
        This method returns a complete user object. */
        function getCurrentUser(){
          var token = getToken();
          var payload = angular.fromJson($window.atob(token.split('.')[1]));
          var user = {
            _id: payload._id,
            username: payload.username,
            fullName: payload.fullName,
            isAdmin: payload.isAdmin,
            voornaam: payload.voornaam,
            naam: payload.naam,
            typeuser: payload.typeuser
          };
          return user;
        }

        /* This method will send a "forgot password" email to the given email adres, if the user exists. */
        function forgotPassword(user){
          return $http.post('/api/users/forgot', user).success(function(data) {
          }).error(function(err){
            return err;
          });
        }

        /* Reset the users password with the same token as the token in the link send by email. */
        function resetPassword(user){
          return $http.put('/api/users/reset/' + user.resetPasswordToken, user).success(function(data) {
              console.log(data);
          }).error(function(err){
            console.log(err);
            return err;
          });
        }
    }
})();
