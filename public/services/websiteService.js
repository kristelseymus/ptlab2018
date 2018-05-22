(function() {

    'use strict';

    angular.module('ptlab').factory('websiteService', websiteService);

    websiteService.$inject = ['$http', '$window', '$log', 'auth'];

    function websiteService($http, $window, $log, auth) {
        var service = {
            getWebsiteContent: getWebsiteContent,
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

        /* Get the content from the website.
              JSON file structure:
                - home (text in the 'home' section)
                  + content
                - voorwie (text that is displayed inside the table)
                  + manager
                  + coworker
                  + student
                - prijzen
                  + content
                - practicals
                  + content (text displayed at the top of the 'practicals' section)
                  + openingsuren (consists of an array of days)
                  + adres (consists of multiple keys that form the complete address)

        */
        function getWebsiteContent() {
          return $http.get('/configuration/content.json')
            .success(function(data){
              return data;
            })
            .error(function(err){
              err.message = "Er is een fout opgetreden. Probeer opnieuw."
              return err;
            });
        }

        /* Get all the blocked dates from this year and the the following years. */
        function getAllBlockedDatesPastAndFromThisYear(){
          return $http.get('/api/blockeddates').success(function(data){
            return data;
          });
        }

        /* Get all the blocked dates from a specific year. */
        function getBlockedDates(year){
          return $http.get('/api/blockeddates/' + year).success(function (data) {
            return data;
          });
        }

        /* Add a date as blocked in an existing array of blocks of a specific year */
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

        /* Create a new blockeddate model, when there are no custom blocked dates yet for that specific year. */
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

        /* Unblock a date that was previously blocked (only custom blocked days, holidays and weekends can't be unblocked) */
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

        function getContent(){
          return $http.get('/api/content', {cache: true}).success(function(data){
            return data;
          })
          .error(function(err){
            err.message = "Er is een fout opgetreden. Probeer opnieuw."
            return err;
          });
        }

        function updateContent(content){
          return $http.put('/api/content/' + content._id, content, {
            headers: {
                Authorization: 'Bearer ' + auth.getToken()
            }
          }).success(function (data) {
            return data;
          });
        }

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

    }
})();
