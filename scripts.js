var map;

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
}

function loadHills() {
    importGpx(gpx[0]);
}

function importGpx(xml) {
    var points = [];
    var bounds = new google.maps.LatLngBounds ();
    $(xml).find("trkpt").each(function() {
        var lat = $(this).attr("lat");
        var lon = $(this).attr("lon");
        var p = new google.maps.LatLng(lat, lon);
        points.push(p);
        bounds.extend(p);
    });

    var poly = new google.maps.Polyline({
        path: points,
        strokeColor: "#FF00AA",
        strokeOpacity: .7,
        strokeWeight: 3,
        map: map
    });
}
