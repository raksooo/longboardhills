(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _routeParserJs = require('./routeParser.js');

var routeParser = _interopRequireWildcard(_routeParserJs);

var _hillLoaderJs = require('./hillLoader.js');

var FormHandler = (function () {
    function FormHandler() {
        _classCallCheck(this, FormHandler);
    }

    _createClass(FormHandler, null, [{
        key: 'postform',
        value: function postform(event, form) {
            event.preventDefault();
            FormHandler.getInfo(form, FormHandler.post);
        }
    }, {
        key: 'getInfo',
        value: function getInfo(form, callback) {
            routeParser.newRoute(form.url.value, function (hill) {
                hill.name = form.name.value;
                hill.busstop = form.busstop.value;
                hill.difficulty = form.difficulty.value;
                hill.traffic = form.traffic.value;
                hill.extra = form.extra.value;

                FormHandler.fixLatLng(hill);
                callback(hill);
            });
        }
    }, {
        key: 'post',
        value: function post(hill) {
            var data = { hill: JSON.stringify(hill) };
            var hillLoader = new _hillLoaderJs.HillLoader();
            $.post('/addHill', data, hillLoader.loadHill.bind(hillLoader, hill));
        }
    }, {
        key: 'fixLatLng',
        value: function fixLatLng(hill) {
            hill.path = $.map(hill.path, function (point) {
                return { lat: point.G, lng: point.K };
            });
        }
    }, {
        key: 'showForm',
        value: function showForm() {
            $('#newHillForm').show();
        }
    }, {
        key: 'hideForm',
        value: function hideForm() {
            $('#newHillForm').hide();
        }
    }]);

    return FormHandler;
})();

window.postform = FormHandler.postform;
window.showForm = FormHandler.showForm;
window.hideForm = FormHandler.hideForm;

},{"./hillLoader.js":2,"./routeParser.js":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var map;

var HillLoader = (function () {
    function HillLoader(_map) {
        _classCallCheck(this, HillLoader);

        if (_map !== undefined) {
            map = _map;
        }
        this.map = map;
    }

    _createClass(HillLoader, [{
        key: 'loadHills',
        value: function loadHills() {
            var _this = this;

            $.get('/getHills', (function (data) {
                $.each(data, (function (i, hill) {
                    _this.loadHill(hill);
                }).bind(_this));
            }).bind(this));
        }
    }, {
        key: 'loadHill',
        value: function loadHill(hill) {
            var line = this.drawPoly(hill.path);

            var infoContent = '<h1 id="firstHeading" class="firstHeading">' + hill.name + '</h1><p>' + '<b>Distance:</b> ' + hill.distance + '<br />' + '<b>Decline:</b> ' + hill.decline + 'm<br />' + '<b>Busstop:</b> ' + hill.busstop + '<br />' + '<b>Difficulty:</b> ' + hill.difficulty + '/10<br />' + '<b>Traffic:</b> ' + hill.traffic + '/10<br />' + '<b>Info:</b> ' + hill.extra + '</p>';
            var infoWindow = new google.maps.InfoWindow({
                content: infoContent,
                maxWidth: 400
            });

            var marker = new google.maps.Marker({
                position: hill.path[0],
                map: map,
                title: hill.name
            });

            var open = infoWindow.open.bind(infoWindow, map, marker);
            line.addListener('click', open);
            marker.addListener('click', open);
        }
    }, {
        key: 'drawPoly',
        value: function drawPoly(points) {
            var line = new google.maps.Polyline({
                path: points,
                strokeColor: "#FF00AA",
                strokeOpacity: .7,
                strokeWeight: 3,
                map: this.map
            });

            return line;
        }
    }]);

    return HillLoader;
})();

exports.HillLoader = HillLoader;

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

require('./formHandler.js');

var _hillLoader = require('./hillLoader');

var map, hillLoader;

$(function () {
    new Main();
});

var Main = (function () {
    function Main() {
        _classCallCheck(this, Main);

        this.createMap();

        hillLoader = new _hillLoader.HillLoader(map);
        hillLoader.loadHills();
    }

    _createClass(Main, [{
        key: 'createMap',
        value: function createMap() {
            var mapCanvas = $('#map')[0];
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
                    mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.TERRAIN],
                    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
                }
            };
            map = new google.maps.Map(mapCanvas, mapOptions);
        }
    }]);

    return Main;
})();

},{"./formHandler.js":1,"./hillLoader":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.newRoute = newRoute;
var directionsService, elevator;

$(function () {
    directionsService = new google.maps.DirectionsService();
    elevator = new google.maps.ElevationService();
});

function newRoute(url, callback) {
    var instructions = gMapsUrlPointParser(url);
    getPath(instructions, function (path) {
        calculateElevation(instructions, function (decline) {
            var hill = {
                path: path,
                decline: decline,
                distance: getDistance(path)
            };

            callback(hill);
        });
    });
}

function getDistance(path) {
    var line = new google.maps.Polyline({ path: path });
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
        optimizeWaypoints: false
    }, function (response, status) {
        callback(response.routes[0].overview_path);
    });
}

function calculateElevation(directions, callback) {
    var locations = { locations: [directions.origin, directions.destination] };
    elevator.getElevationForLocations(locations, function (elevation, eStatus) {
        var decline = Math.round(Math.abs(elevation[0].elevation - elevation[1].elevation)) + 'm';
        callback(decline);
    });
}

function gMapsUrlPointParser(url, callback) {
    var directions = {};
    url = url.substring(url.indexOf("/maps/dir/") + "/maps/dir/".length);
    var urlComponents = url.split('/');

    directions.destination = {};
    var dest = urlComponents[1].split(',');
    directions.destination.lat = parseFloat(dest[0]);
    directions.destination.lng = parseFloat(dest[1]);

    directions.waypoints = [];
    var data = urlComponents[3];
    var index = 0;
    while ((index = data.indexOf('!1d')) !== -1) {
        data = data.substring(index + '!1d'.length);
        var lng = data.substring(0, data.indexOf('!'));
        lng = parseFloat(lng);
        data = data.substring(data.indexOf('!2d') + '!2d'.length);
        var lat = data.substring(0, data.indexOf('!'));
        lat = parseFloat(lat);

        if (directions.origin) {
            directions.waypoints.push({ location: { lat: lat, lng: lng }, stopover: false });
        } else {
            directions.origin = { lat: lat, lng: lng };
        }
    }

    return directions;
}

google.maps.Polyline.prototype.inMeters = function (n) {
    var a = this.getPath(n),
        len = a.getLength(),
        dist = 0;
    for (var i = 0; i < len - 1; i++) {
        dist += a.getAt(i).metersTo(a.getAt(i + 1));
    }
    return dist;
};
google.maps.LatLng.prototype.metersTo = function (a) {
    var e = Math,
        ra = e.PI / 180;
    var b = this.lat() * ra,
        c = a.lat() * ra,
        d = b - c;
    var g = this.lng() * ra - a.lng() * ra;
    var f = 2 * e.asin(e.sqrt(e.pow(e.sin(d / 2), 2) + e.cos(b) * e.cos(c) * e.pow(e.sin(g / 2), 2)));
    return f * 6378.137 * 1000;
};

},{}]},{},[3]);
