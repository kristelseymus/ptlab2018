(function () {
    'use strict';

    angular.module('ptlab').factory('eventService', eventService);

    eventService.$inject = ['$http', 'auth'];

    function eventService($http, auth) {


        var service = {
            getAll: getAll,
            create: create,
            get: get,
            update: update,
            getEventTypes: getEventTypes,
            getEventsByDay: getEventsByDay,
            getEventsByDayInRoom: getEventsByDayInRoom,
            deleteEvent: deleteEvent
        };
        return service;

        /* Get all events */
        function getAll() {
            return $http.get('/api/events').success(function (data) {
                return data;
            });
        }

        /* Create a new event */
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

        /* Get an event with a specific id (param) */
        function get(id) {
            return $http.get('/api/events/' + id).then(function (res) {
                return res.data;
            });
        }

        /* Update an event */
        function update(id, evenement) {
            return $http.put('/api/events/' + id, evenement, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function (data) {
                return data;
            });
        }

        /* Get all eventtypes.
        There are 2 types of events:
          - "Evenement"
          - "Training"
        */
        function getEventTypes() {
          return $http.get('/api/eventtypes').success(function (data) {
              return data;
          });
        }

        /* Get all events taking place on a specific date (param) */
        function getEventsByDay(date) {
          var d = new Date(date);
          d.setHours(0,0,0,0);
          return $http.get('api/events/' + d).then(function (res) {
            return res.data;
          })
        }

        /* Get all events taking place in a specific room (param) on a specific date (param) */
        function getEventsByDayInRoom(date, ruimteid){
          var d = new Date(date);
          d.setHours(0,0,0,0);
          return $http.get('/api/events/' + d + "/" + ruimteid).then(function (res){
            return res.data;
          });
        }

        /* Delete an event */
        function deleteEvent(evenement) {
            return $http.delete('/api/events/' + evenement._id + '/' + evenement.user._id, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function (res) {
              return res.data;
            }).error(function (error){
              return error;
            });
        }
    } // END eventService
})();
