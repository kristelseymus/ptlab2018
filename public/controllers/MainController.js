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

        activate();


        function activate() {
          return load();
        }
        function load(){
            getUsers();
            getOpeningsuren();
            getEvents();
        }

        function getUsers() {
            return auth.getAll()
                .then(function(data) {
                    vm.users = data.data;
                    return vm.users;
                });
        }

        function getOpeningsuren(){
            return $http.get('/javascripts/content.json').success(function(data){
              vm.openingsuren = data.openingsuren.dag;
            });
        }

        function getEvents(){
          vm.events = eventService.getAll().then(function(res){
            console.log(res.data);
            console.log("in getEvents MainController");
            vm.events = res.data;
            var evenement;
            for(evenement of vm.events){
              console.log(evenement);
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
          vm.dateClicked.setDate(date);
          showDialog();
          console.log(vm.dateClicked);
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

          $mdDialog.show({
            parent: angular.element(document.body),
            templateUrl: '/templates/dialogevent.html',
            hasBackdrop: true,
            panelClass: 'dialog-events',
            targetEvent: ev,
            clickOutsideToClose: true,
            escapeToClose: true,
            allowParentalScroll: true
          });
        };
    }

})();
