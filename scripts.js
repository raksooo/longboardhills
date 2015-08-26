var map;

function initialize() {
    var mapCanvas = document.getElementById('map');
    var mapOptions = {
        center: new google.maps.LatLng(57.7, 11.98),
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
    map.data.loadGeoJson('data.json');
}

google.maps.event.addDomListener(window, 'load', initialize);
