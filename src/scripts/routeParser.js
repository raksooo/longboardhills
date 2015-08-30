var directionsService, elevator;

$(function (){
    directionsService = new google.maps.DirectionsService();
    elevator = new google.maps.ElevationService();
});

export function newRoute(url, callback) {
    var instructions = gMapsUrlPointParser(url);
    getPath(instructions, function(path) {
        calculateElevation(instructions, function(decline) {
            var hill = {
                path: path,
                decline: decline,
                distance: getDistance(path),
            }

            callback(hill);
        });
    });
}

function getDistance(path) {
    var line = new google.maps.Polyline({path: path});
    var length = line.inMeters();
    var meters = Math.round(length) + 'm';
    var kms = (length / 1000).toFixed(1) + 'Km (' + meters + ')';
    length = length > 1000 ? kms : meters;

    return length;
}

function getPath(instructions, callback) {
    directionsService.route({
        origin: instructions.origin,
        destination: instructions.destination,
        travelMode: google.maps.TravelMode.WALKING,
        unitSystem: google.maps.UnitSystem.METRIC,
        waypoints: instructions.waypoints,
        optimizeWaypoints: false,
    }, function(response, status) {
        callback(response.routes[0].overview_path);
    });
}

function calculateElevation(directions, callback) {
    var locations = {locations: [directions.origin, directions.destination]};
    elevator.getElevationForLocations(locations, function(elevation, eStatus) {
        var decline = Math.round(Math.abs(elevation[0].elevation - elevation[1].elevation));
        callback(decline);
    });
}

function isFloat(str) {
    return !isNaN(str) && str.toString().indexOf('.') != -1;
}

function gMapsUrlPointParser(url, callback) {
    let directions = {
        origin: {},
        destination: {},
        waypoints: []
    };
    url = url.substring(url.indexOf("/maps/dir/") + "/maps/dir/".length);
    let urlComponents = url.split('/');

    let first = urlComponents[0].split(',');
    let second = urlComponents[1].split(',');
    if (first.length === 2 && isFloat(first[0]) && isFloat(first[1])) {
        directions['origin'].lat = parseFloat(first[0]);
        directions['origin'].lng = parseFloat(first[1]);
    }
    if (second.length === 2 && isFloat(second[0]) && isFloat(second[1])) {
        directions['destination'].lat = parseFloat(second[0]);
        directions['destination'].lng = parseFloat(second[1]);
    }

    let data = urlComponents[3];
    while (data && data.indexOf('!1d') !== -1) {
        data = data.substring(data.indexOf('!1d') + '!1d'.length);
        var lng = data.substring(0, data.indexOf('!'));
        lng = parseFloat(lng);
        data = data.substring(data.indexOf('!2d') + '!2d'.length);
        var lat = data.substring(0, data.indexOf('!'));
        lat = parseFloat(lat);

        if (directions.origin.lat === undefined) {
            directions.origin = {lat: lat, lng: lng};
        } else {
            directions.waypoints.push({location: {lat: lat, lng: lng}, stopover: false});
        }
    }

    if (directions.destination.lat === undefined && directions.waypoints.length > 0) {
        directions.destination = directions.waypoints.pop().location;
    }

    if (!directions.origin.lat || !directions.destination.lat) {
        throw new URLMismatchError();
    }

    return directions;
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

