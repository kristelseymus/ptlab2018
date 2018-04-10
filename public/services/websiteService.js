(function() {

    'use strict';

    angular.module('ptlab').factory('websiteService', websiteService);

    websiteService.$inject = ['$http', '$window', '$log'];

    function websiteService($http, $window, $log) {
        var service = {
            getWebsiteContent: getWebsiteContent
        };
        return service;

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
