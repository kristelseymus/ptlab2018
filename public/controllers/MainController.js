(function() {

    'use strict';

    angular.module('ptlab').controller('MainController', MainController);

    MainController.$inject = ['$http', '$log', 'auth', '$state', '$stateParams', 'eventService', 'MaterialCalendarData', '$scope', '$mdDialog'];

    function MainController($http, $log, auth, $state, $stateParams, eventService, MaterialCalendarData, $scope, $mdDialog) {
        var vm = this;
        vm.users = [];
        vm.getUsers = getUsers;
        vm.openingsuren = [];
        vm.events = [];
        vm.setDayContent = setDayContent;
        vm.dateClicked = new Date();
        $scope.dayClick = dayClick;
        $scope.cancel = cancel;
        vm.showDialog = showDialog;
        vm.eventsday = {};
        vm.getEventsByDay = getEventsByDay;

        activate();


        function activate() {
          return load();
        }
        function load(){
            getUsers();
            getOpeningsuren();
            getEvents();
            //eventsByDay(new Date());
        }

        function getUsers() {
            return auth.getAll()
                .then(function(data) {
                    vm.users = data.data;
                    return vm.users;
                });
        }

        function getOpeningsuren(){
          //Moet naar websiteService
            return $http.get('/javascripts/content.json').success(function(data){
              vm.openingsuren = data.openingsuren.dag;
            });
        }

        function getEvents(){
          vm.events = eventService.getAll().then(function(res){
            vm.events = res.data;
            var evenement;
            for(evenement of vm.events){
              var content = createContentCalendar(evenement);
              setDayContent(evenement.startdate, content);
            }
            return vm.events;
          });
        }

        function setDayContent(date, content){
          MaterialCalendarData.setDayContent(new Date(date), content);
        }

        function dayClick(date){
          console.log("Clicked on date");
          console.log(date);
          vm.dateClicked = date;
          console.log(vm.dateClicked);
          getEventsByDay(date);
          showDialog();
        }

        function cancel(){
          $mdDialog.cancel();
        }

        function createContentCalendar(evenement){
          var string = "";
          string += "<div class='item-box text-center'><h7>" + evenement.name + "</h7></div>";
          return string;
        }

        function showDialog(ev) {
          console.log("showDialog");
          console.log(vm.eventsday);
          $mdDialog.show({
            parent: angular.element(document.body),
            controller: MainController,
            controllerAs: 'ctrl',
            templateUrl: '/templates/dialogevent.html',
            hasBackdrop: true,
            panelClass: 'dialog-events',
            //targetEvent: ev,
            clickOutsideToClose: true,
            escapeToClose: true,
            allowParentalScroll: true
          });
        }

        function getEventsByDay(date){
          vm.eventsday = eventService.getEventsByDay(date).then(function(res){
            vm.eventsday = res;
            console.log("res");
            console.log(res);
            console.log(vm.eventsday);
            return vm.eventsday;
          });
        }
    }

})();
