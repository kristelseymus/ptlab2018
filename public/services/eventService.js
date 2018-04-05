(function () {
    'use strict';

    angular.module('ptlab').factory('eventService', eventService);

    eventService.$inject = ['$log', '$http', 'auth'];

    function eventService($log, $http, auth) {


        var service = {
            getAll: getAll,
            create: create,
            get: get,
            update: update,
            //deleteEvent: deleteEvent,
            getEventTypes: getEventTypes,
            getEventsByDay: getEventsByDay,
            deleteEvent: deleteEvent
        };
        return service;

        function getAll() {
            return $http.get('/api/events').success(function (data) {
                return data;
            });
        }

        function create(evenement) {
          return $http.post('/api/events', evenement, {
              headers: {
                  Authorization: 'Bearer ' + auth.getToken()
              }
          }).success(function (data) {
              return data;
          }).error(function(err){
            return err;
          });
        }

        function get(id) {
            return $http.get('/api/events/' + id).then(function (res) {
                return res.data;
            });
        }

        function update(id, evenement) {
            $log.log("update in eventService was called");
            return $http.put('/api/events/' + id, evenement, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function (data) {
                return data;
            });

        }
        /*
        function deleteEvent(event) {
            return $http.delete('/api/reservatie/' + event._id, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).then(function (res) {
                return res.data;
            })
        }
*/
        function getEventTypes() {
          return $http.get('/api/eventtypes').success(function (data) {
              return data;
          });
        }

        function getEventsByDay(date) {
          return $http.get('api/events/' + date).then(function (res) {
            return res.data;
          })
        }

        function deleteEvent(evenement) {
          console.log("in service");
          console.log(evenement);
            return $http.delete('/api/events/' + evenement._id + '/' + evenement.user, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function (res) {
              console.log("success");
              console.log(res);
              return res.data;
            }).error(function (error){
              console.log("error");
              console.log(error);
              return error;
            });
        }
    }
})();
