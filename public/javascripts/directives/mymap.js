(function () {
    'use strict';
    angular.module('ptlab')
    .directive('myMap', function() {
      var link = function(scope, element, attrs) {
          var map, infoWindow;
          var markers = [];

          // map config
          var mapOptions = {
              center: new google.maps.LatLng(51.119558, 4.204349),
              zoom: 15,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              scrollwheel: false
          };

          // init the map
          function initMap() {
              if (map === void 0) {
                  map = new google.maps.Map(element[0], mapOptions);
              }
          }

          // place a marker
          function setMarker(map, position, title, content) {
              var marker;
              var markerOptions = {
                  position: position,
                  map: map,
                  title: title
              };

              marker = new google.maps.Marker(markerOptions);
              markers.push(marker); // add marker to array

              google.maps.event.addListener(marker, 'click', function () {
                  // close window if not undefined
                  if (infoWindow !== void 0) {
                      infoWindow.close();
                  }
                  // create new window
                  var infoWindowOptions = {
                      content: content
                  };
                  infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                  infoWindow.open(map, marker);
              });
          }

          // show the map and place some markers
          initMap();

          setMarker(map, new google.maps.LatLng(51.119558, 4.204349), 'London', '<div><strong>Planet Talent</strong></div><br/><div>Frank van Dyckelaan 7b<br/>9140 Temse<br/>+32 3 226 48 28</div><br/><a href="https://www.google.com/maps?ll=51.119558,4.204349&z=19&t=m&hl=nl-NL&gl=US&mapclient=apiv3&cid=17135057385883886370" target="_blank">Weergeven in Google Maps</a>');
          //setMarker(map, new google.maps.LatLng(52.370216, 4.895168), 'Amsterdam', 'More content');
          //setMarker(map, new google.maps.LatLng(48.856614, 2.352222), 'Paris', 'Text here');
      };

      return {
          restrict: 'A',
          template: '<div id="gmaps"></div>',
          replace: true,
          link: link
      };
    });

})();
