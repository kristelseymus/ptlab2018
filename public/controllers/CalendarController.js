(function() {

    'use strict';

    angular.module('ptlab').controller('CalendarController', CalendarController);

    CalendarController.$inject = ['$mdDialog', 'eventday', 'day'];

    function CalendarController($mdDialog, eventday, day) {
        var vm = this;
        vm.eventday = eventday;
        vm.dateClicked = day;
        vm.cancel = cancel;
        //vm.isEmpty = isEmpty;
        vm.getEndTime = getEndTime;

        function cancel(){
          $mdDialog.cancel();
        }

        //function isEmpty(){
        //  if(vm.eventsday.length === 0){ return true; }
        //  return false;
        //}

        function getEndTime(ev){
          var tempDate = new Date(ev.startdate);
          tempDate.setMinutes(tempDate.getMinutes() + ev.duur);
          return tempDate;
        }
    }

})();
