(function() {

    'use strict';

    angular.module('ptlab').factory('websiteService', websiteService);

    websiteService.$inject = ['$http', '$window', '$log', 'auth'];

    function websiteService($http, $window, $log, auth) {
        var service = {
            getAllBlockedDatesPastAndFromThisYear: getAllBlockedDatesPastAndFromThisYear,
            getBlockedDates: getBlockedDates,
            updateBlockedDates: updateBlockedDates,
            createBlockedDates: createBlockedDates,
            deleteBlockedDate: deleteBlockedDate,
            getContent: getContent,
            updateContent: updateContent,
            postWebsite: postWebsite
        };
        return service;

        /* Get all the blocked dates from this year and the the following years */
        function getAllBlockedDatesPastAndFromThisYear(){
          return $http.get('/api/blockeddates').success(function(data){
            return data;
          });
        }

        /* Get all the blocked dates from a specific year (param) */
        function getBlockedDates(year){
          return $http.get('/api/blockeddates/' + year).success(function (data) {
            return data;
          });
        }

        /* Add a date in an existing array of blocked dates of a specific year */
        function updateBlockedDates(date){
          var blockeddates = {
            year: date.getFullYear(),
            blockeddate: date
          }
          return $http.put('/api/blockeddates/' + blockeddates.year, blockeddates, {
            headers: {
                Authorization: 'Bearer ' + auth.getToken()
            }
          }).success(function (data) {
            return data;
          });
        }

        /* Create a new blockeddates model, when there are no custom blocked dates yet for that specific year. */
        function createBlockedDates(date){
          var blockedDate = {
            year: date.getFullYear(),
            blockeddates: [date]
          }
          return $http.post('/api/blockeddates', blockedDate, {
            headers: {
                Authorization: 'Bearer ' + auth.getToken()
            }
          }).success(function (data) {
            return data;
          }).error(function(err){
            return err;
          });
        }

        /* Unblock a date that was previously blocked (only self blocked days, holidays and weekends can't be unblocked) */
        function deleteBlockedDate(blockeddates){
          return $http.delete('/api/blockeddates/' + blockeddates.year + '/' + blockeddates.blockeddates, {
            headers: {
              Authorization: 'Bearer ' + auth.getToken()
            }
          }).success(function(res){
            return res;
          }).error(function(err){
            return err;
          });
        }

        /* Get the content of the webiste */
        function getContent(){
          return $http.get('/api/content', {cache: true}).success(function(data){
            return data;
          })
          .error(function(err){
            err.message = "Er is een fout opgetreden. Probeer opnieuw."
            return err;
          });
        }

        /* Update the content of the website */
        function updateContent(content){
          return $http.put('/api/content/' + content._id, content, {
            headers: {
                Authorization: 'Bearer ' + auth.getToken()
            }
          }).success(function (data) {
            return data;
          });
        }

        /* Add a new content object to the database */
        function postWebsite(content) {
          return $http.post('/api/content', content, {
            headers: {
                Authorization: 'Bearer ' + auth.getToken()
            }
          }).success(function (data) {
            return data;
          }).error(function(err){
            return err;
          });
        }

    } // END websiteService
})();
