(function() {

    'use strict';

    angular.module('ptlab').controller('CalendarController', CalendarController);

    CalendarController.$inject = ['$mdDialog', 'eventday', 'day'];

    function CalendarController($mdDialog, eventday, day) {
        var vm = this;

        vm.eventday = eventday;
        vm.dateClicked = day;
        vm.cancel = cancel;
        vm.getEndTime = getEndTime;

        /* Close dialog */
        function cancel(){
          $mdDialog.cancel();
        }

        /* Get the time of an event when it is done */
        function getEndTime(ev){
          var tempDate = new Date(ev.startdate);
          tempDate.setMinutes(tempDate.getMinutes() + ev.duur);
          return tempDate;
        }
    } // END CalendarController

})();
