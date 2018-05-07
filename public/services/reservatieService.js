(function () {
    'use strict';

    angular.module('ptlab').factory('reservatieService', reservatieService);

    reservatieService.$inject = ['$log', '$http', 'auth'];

    function reservatieService($log, $http, auth) {

        var service = {
            getAll: getAll,
            create: create,
            get: get,
            update: update,
            deleteReservatie: deleteReservatie,
            getReservatiesUser: getReservatiesUser,
            getReservatiesByDay: getReservatiesByDay,
            getReservatiesByDayFromASpecificRoom: getReservatiesByDayFromASpecificRoom
        };
        return service;

        /* Get all reservations */
        function getAll() {
            return $http.get('/api/reservaties').success(function (data) {
                return data;
            });
        }

        /* Create a new reservation */
        function create(reservatie) {
          return $http.post('/api/reservaties', reservatie, {
              headers: {
                  Authorization: 'Bearer ' + auth.getToken()
              }
          }).success(function (data) {
              return data;
          }).error(function(err){
            return err;
          });
        }

        /* Get a specific reservation by id */
        function get(id) {
            return $http.get('/api/reservaties/' + id).then(function (res) {
                return res.data;
            });
        }

        /* Get all reservations from a user */
        function getReservatiesUser(id){
          return $http.get('/api/reservaties/user/' + id).then(function(res){
            return res.data;
          })
        }

        /* Update an existing reservation */
        function update(id, reservatie) {
            return $http.put('/api/reservaties/' + id, reservatie, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function (data) {
                return data;
            });
        }

        /* Delete a specific reservation */
        function deleteReservatie(reservatie) {
            return $http.delete('/api/reservaties/' + reservatie._id + '/' + reservatie.user._id, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function (res) {
              return res.data;
            }).error(function (error){
              return error;
            });
        }

        /* Get all reservations from a specific date */
        function getReservatiesByDay(date) {
          return $http.get('/api/reservaties/' + date).success(function (res) {
            console.log(res);
            return res.data;
          }).error(function(err){
            console.log(err);
          });
        }

        /* Get all reservations from a specific date in a specific room */
        function getReservatiesByDayFromASpecificRoom(date, ruimteid){
          return $http.get('/api/reservaties/' + date + '/' + ruimteid).then(function(res){
            return res.data;
          });
        }
    }
})();
