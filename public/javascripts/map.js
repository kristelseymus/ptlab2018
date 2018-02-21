function Location(lat, long, accuracy) {
    this.lat = lat;
    this.long = long;
    this.accuracy = accuracy;
    this.time = new Date();
}

var map = {
    locations: [],
    addLocation: function (lat, long, accuracy) {
        this.locations.push(new Location(lat, long, accuracy));
    },
    getStartLocation: function () {
        return this.locations[0];
    },
    getCurrentLocation: function () {
        return this.locations[this.locations.length - 1];
    },
    getTotalDistance: function () {
        var total = 0;
        for (var i = 0; i < this.locations.length - 1; i++) {
            total += this.calcDistance(this.locations[i], this.locations[i + 1]);
        }
        return total;
    }
};
var viewMap = {
    kaart: null,
    status: '',
    map: null,
    init: function () {
        this.kaart = map;
        this.createMap();
    },
    createMap: function () {
        var latlng = new google.maps.LatLng(51.119558, 4.204349);
        options = {zoom: 15, center: latlng, mapTypeId: google.maps.MapTypeId.ROADMAP};
        this.map = new google.maps.Map(document.getElementById("map"), options);
        //var image = '../images/azure.png';
        var marker = new google.maps.Marker({
            position: latlng,
            map: this.map
            //icon: image
          });

        var locations = [
            ['Planet Talent', 51.119558, 4.204349, 1]

        ];

        var infowindow = new google.maps.InfoWindow();
        google.maps.event.addListener(marker, 'click', function(){
          infowindow.setContent("<div><strong>Planet Talent</strong></div><br/>"+
          "<div>Frank van Dyckelaan 7b<br/>9140 Temse<br/>+32 3 226 48 28</div><br/>"+
          "<a href='https://www.google.com/maps?ll=51.119558,4.204349&z=19&t=m&hl=nl-NL&gl=US&mapclient=apiv3&cid=17135057385883886370' target='_blank'>Weergeven in Google Maps</a>");
          infowindow.open(map, this);
        });

    },
};
window.onload = function () {
    viewMap.init();
};
Number.prototype.toRadians = function () {
    return this * Math.PI / 180;
};
Date.prototype.hhmmss = function () {
    var hh = this.getHours().toString();
    var mm = this.getMinutes().toString(); // getMonth() is zero-based
    var ss = this.getSeconds().toString();
    return (hh[1] ? hh : "0" + hh[0]) + ":" + (mm[1] ? mm : "0" + mm[0]) + ":"
            + (ss[1] ? ss : "0" + ss[0]); // padding
};
