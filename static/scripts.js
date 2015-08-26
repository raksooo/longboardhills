var map, elevator;

$(function() {
    initialize();
    loadHills();
});

function initialize() {
    var mapCanvas = document.getElementById('map');
    var mapOptions = {
        center: {
            lat: 57.7,
            lng: 11.98
        },
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        streetViewControl: true,
        panControl: false,
        panControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
        },
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
        },
        mapTypeControlOptions: {
            mapTypeIds: [
                google.maps.MapTypeId.ROADMAP,
                google.maps.MapTypeId.SATELLITE,
                google.maps.MapTypeId.TERRAIN
            ],
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        }
    }
    map = new google.maps.Map(mapCanvas, mapOptions);
    elevator = new google.maps.ElevationService;
}

function loadHills() {
    $.each(hills, function(i, v) {
        var points = extractGpx(gpx[i]);
        var line = drawPoly(points);

        var length = line.inMeters();
        var meters = Math.round(length) + 'm';
        var kms = (length / 1000).toFixed(1) + 'Km (' + meters + ')';
        length = length > 1000 ? kms : meters;

        // TODO: Flytta till import delen
        var locations = {locations: [points[0], points[points.length-1]]};
        elevator.getElevationForLocations(locations, function(elevation, eStatus) {
            if (eStatus === google.maps.ElevationStatus.OK) {
                var decline = Math.round(Math.abs(elevation[0].elevation - elevation[1].elevation)) + 'm';
            }
        });

        var infoContent = '<h1 id="firstHeading" class="firstHeading">' + v.name + '</h1><p>' +
                          '<b>Length:</b> ' + length + '<br />' +
                          '<b>Decline:</b> ' + v.decline + 'm<br />' +
                          '<b>Busstop:</b> ' + v.busstop + '<br />' +
                          '<b>Difficulty:</b> ' + v.difficulty + '/10<br />' +
                          '<b>Traffic:</b> ' + v.traffic + '/10<br />' +
                          '<b>Info:</b> ' + v.extra + '</p>';
        var infoWindow = new google.maps.InfoWindow({
            content: infoContent,
            maxWidth: 400
        });

        var marker = new google.maps.Marker({
            position: points[0],
            map: map,
            title: v.name
        });
        line.addListener('click', function() {
            infoWindow.open(map, marker);
        });
        marker.addListener('click', function() {
            infoWindow.open(map, marker);
        });
    });
}

function extractGpx(xml) {
    var points = [];
    $(xml).find("trkpt").each(function() {
        var lat = $(this).attr("lat");
        var lon = $(this).attr("lon");
        var p = new google.maps.LatLng(lat, lon);
        points.push(p);
    });

    return points;
}

function drawPoly(points) {
    var line = new google.maps.Polyline({
        path: points,
        strokeColor: "#FF00AA",
        strokeOpacity: .7,
        strokeWeight: 3,
        map: map
    });

    return line;
}

google.maps.Polyline.prototype.inMeters = function(n){
    var a = this.getPath(n), len = a.getLength(), dist = 0;
    for(var i=0; i<len-1; i++){
        dist += a.getAt(i).metersTo(a.getAt(i+1));
    }
    return dist;
}
google.maps.LatLng.prototype.metersTo = function(a){
    var e = Math, ra = e.PI/180;
    var b = this.lat() * ra, c = a.lat() * ra, d = b - c;
    var g = this.lng() * ra - a.lng() * ra;
    var f = 2 * e.asin(e.sqrt(e.pow(e.sin(d/2), 2) + e.cos(b) * e.cos
                (c) * e.pow(e.sin(g/2), 2)));
    return f * 6378.137 * 1000;
}

