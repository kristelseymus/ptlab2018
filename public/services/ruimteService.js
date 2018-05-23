(function () {
    'use strict';

    angular.module('ptlab').factory('ruimteService', ruimteService);

    ruimteService.$inject = ['$log', '$http', 'auth'];

    function ruimteService($log, $http, auth) {
        var service = {
            getAll: getAll,
            create: create,
            get: get,
            update: update,
            deleteRuimte: deleteRuimte
        };
        return service;

        /* Get all rooms */
        function getAll() {
            return $http.get('/api/ruimtes').success(function (data) {
                return data;
            });
        }

        /* Create a new room */
        function create(ruimte) {
            return $http.post('/api/ruimtes', ruimte, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function (data) {
                return data;
            });
        }

        /* Get a specific room by id (param) */
        function get(id) {
            return $http.get('/api/ruimtes/' + id).then(function (res) {
                return res.data;
            });
        }

        /* Update an existing room */
        function update(id, ruimte) {
            return $http.put('/api/ruimtes/' + id, ruimte, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function (data) {
                return data;
            });

        }

        /* Delete a room */
        function deleteRuimte(ruimte) {
            return $http.delete('/api/ruimtes/' + ruimte._id, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).then(function (res) {
                return res.data;
            })
        }
    } // END ruimteService
})();
