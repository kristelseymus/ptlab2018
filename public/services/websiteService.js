(function() {

    'use strict';

    angular.module('ptlab').factory('websiteService', websiteService);

    websiteService.$inject = ['$http', '$window', '$log'];

    function websiteService($http, $window, $log) {
        var service = {
            getWebsiteContent: getWebsiteContent
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

    }
})();
