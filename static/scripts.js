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
    $.get('/getHills', function(data) {
        $.each(data, function(i, hill) {
            loadHill(hill);
        });
    });
}

function loadHill(hill) {
    var line = drawPoly(hill.path);

    var infoContent = '<h1 id="firstHeading" class="firstHeading">' + hill.name + '</h1><p>' +
        '<b>Distance:</b> ' + hill.distance + '<br />' +
        '<b>Decline:</b> ' + hill.decline + 'm<br />' +
        '<b>Busstop:</b> ' + hill.busstop + '<br />' +
        '<b>Difficulty:</b> ' + hill.difficulty + '/10<br />' +
        '<b>Traffic:</b> ' + hill.traffic + '/10<br />' +
        '<b>Info:</b> ' + hill.extra + '</p>';
    var infoWindow = new google.maps.InfoWindow({
        content: infoContent,
        maxWidth: 400
    });

    var marker = new google.maps.Marker({
        position: hill.path[0],
        map: map,
        title: hill.name
    });
    line.addListener('click', function() {
        infoWindow.open(map, marker);
    });
    marker.addListener('click', function() {
        infoWindow.open(map, marker);
    });
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

