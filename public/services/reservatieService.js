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
            getReservatiesUser: getReservatiesUser
        };
        return service;

        function getAll() {
            return $http.get('/api/reservaties').success(function (data) {
                return data;
            });
        }

        function create(reservatie) {
          console.log("service: ");
          console.log(reservatie);
          console.log(reservatie.user);
            return $http.post('/api/reservaties', reservatie, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function (data) {
                return data;
            });
        }

        function get(id) {
            return $http.get('/api/reservaties/' + id).then(function (res) {
                return res.data;
            });
        }

        function getReservatiesUser(id){
          return $http.get('/api/reservaties/user/' + id).then(function(res){
            console.log(res.data);
            return res.data;
          })
        }

        function update(id, reservatie) {
            $log.log("update in reservatieService was called");
            return $http.put('/api/reservaties/' + id, reservatie, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function (data) {
                return data;
            });

        }

        function deleteReservatie(reservatie) {
            return $http.delete('/api/reservatie/' + reservatie._id, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).then(function (res) {
                return res.data;
            })
        }
    }
})();
