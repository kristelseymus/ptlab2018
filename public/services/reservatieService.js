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
            getReservatieTypes: getReservatieTypes,
            getReservatiesByDay: getReservatiesByDay
        };
        return service;

        function getAll() {
            return $http.get('/api/reservaties').success(function (data) {
                return data;
            });
        }

        function create(reservatie) {
          return $http.post('/api/reservaties', reservatie, {
              headers: {
                  Authorization: 'Bearer ' + auth.getToken()
              }
          }).success(function (data) {
              return data;
          }).error(function(err){
            console.log(err.message);
            return err;
          });
          /*var noSpace = false;
          var reser = null;
          getReservatiesByDay(reservatie.startdate).then(function(res){
            for(var item of res){
              console.log(item);
              if(item.keuzeDag === reservatie.keuzeDag){
                noSpace = true;
                break;
              }
            }
            console.log("service: ");
            console.log(reservatie);
            console.log(reservatie.user);
            console.log("noSpace: " + noSpace);
            if(noSpace === false){

            } else {
              return next(new Error("No space left in room"));
            }
          });*/


        }

        function get(id) {
            return $http.get('/api/reservaties/' + id).then(function (res) {
                return res.data;
            });
        }

        function getReservatiesUser(id){
          return $http.get('/api/reservaties/user/' + id).then(function(res){
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
          console.log("in deleteService");
          console.log(reservatie._id);
          console.log(reservatie.user);
            return $http.delete('/api/reservaties/' + reservatie._id + '/' + reservatie.user, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function (res) {
              return res.data;
            }).error(function (error){
              console.log(error);
            });
        }

        function getReservatieTypes() {
          return $http.get('/api/reservatietypes').success(function (data) {
              return data;
          });
        }

        function getReservatiesByDay(date) {
          return $http.get('api/reservaties/' + date).then(function (res) {
            return res.data;
          })
        }
    }
})();
