(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _routeParserJs = require('./routeParser.js');

var routeParser = _interopRequireWildcard(_routeParserJs);

var _hillLoaderJs = require('./hillLoader.js');

var newHill;

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
            newHill.addData(form.name.value, form.busstop.value, form.difficulty.value, form.traffic.value, form.extra.value);
            callback(newHill.hill);
        }
    }, {
        key: 'post',
        value: function post(hill) {
            var data = { hill: JSON.stringify(hill) };
            var hillLoader = new _hillLoaderJs.HillLoader();
            $.post('/addHill', data, hillLoader.loadHill.bind(hillLoader, hill));
            FormHandler.hideForm();
        }
    }, {
        key: 'urlEntered',
        value: function urlEntered(event, form) {
            event.preventDefault();

            newHill = new HillCreator();
            try {
                newHill.retrievePath(form.url.value, function (path) {
                    $('#newHillUrl').hide();
                    $('#newHillUrl').removeClass('error');
                    form.reset();

                    FormHandler.loadPreviewMap(path);
                    $('#newHillForm').show();
                    $('#newHillForm input[name="name"]').focus();
                });
            } catch (err) {
                $('#newHillUrl').addClass('error');
            }
        }
    }, {
        key: 'loadPreviewMap',
        value: function loadPreviewMap(path) {
            var mapCanvas = $('#previewMap')[0];
            var map = new google.maps.Map(mapCanvas, {
                center: path[0],
                zoom: 13,
                mapTypeId: google.maps.MapTypeId.TERRAIN,
                streetViewControl: false,
                panControl: false,
                zoomControl: false,
                mapTypeControl: false
            });
            new google.maps.Polyline({
                path: path,
                strokeColor: '#FF00AA',
                strokeOpacity: .7,
                strokeWeight: 3,
                map: map
            });
            var bounds = new google.maps.LatLngBounds();
            $.each(path, function (i, latlng) {
                latlng = new google.maps.LatLng(latlng.lat, latlng.lng);
                bounds.extend(latlng);
            });
            setTimeout(function () {
                google.maps.event.trigger(map, 'resize');
                map.fitBounds(bounds);
            }, 0);
        }
    }, {
        key: 'showForm',
        value: function showForm(path) {
            $('#newHillUrl').show();
            $('#newHillUrl input[type="url"]').focus();
        }
    }, {
        key: 'hideForm',
        value: function hideForm() {
            $('#newHillUrl').hide();
            $('#newHillUrl').removeClass('error');
            $('#newHillForm').hide();
            $('#newHillUrl').find('form').first()[0].reset();
            $('#newHillForm').find('form').first()[0].reset();
        }
    }]);

    return FormHandler;
})();

var HillCreator = (function () {
    function HillCreator() {
        _classCallCheck(this, HillCreator);
    }

    _createClass(HillCreator, [{
        key: 'retrievePath',
        value: function retrievePath(url, callback) {
            var _this = this;

            routeParser.newRoute(url, function (hill) {
                _this.hill = hill;
                _this.fixLatLng();
                callback(hill.path);
            });
        }
    }, {
        key: 'addData',
        value: function addData(name, busstop, difficulty, traffic, extra) {
            this.hill.name = name;
            this.hill.busstop = busstop;
            this.hill.difficulty = Math.round(difficulty);
            this.hill.traffic = Math.round(traffic);
            this.hill.extra = extra;
        }
    }, {
        key: 'fixLatLng',
        value: function fixLatLng() {
            this.hill.path = $.map(this.hill.path, function (point) {
                return { lat: point.G, lng: point.K };
            });
        }
    }]);

    return HillCreator;
})();

window.FormHandler = FormHandler;

},{"./hillLoader.js":2,"./routeParser.js":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _overlayHandler = require('./overlayHandler');

var _mapHandler = require('./mapHandler');

window.difficultyColors = ["#2E7D32", "#558B2F", "#9E9D24", "#F9A825", "#FF8F00", "#EF6C00", "#D84315", "#C62828", "#283593", "#111111", "#000000"];

var HillLoader = (function () {
    function HillLoader() {
        _classCallCheck(this, HillLoader);

        this.mapHandler = _mapHandler.MapHandler.getMapHandler();
        this.overlayHandler = _overlayHandler.OverlayHandler.getOverlayHandler();
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
            if (hill.difficulty === 0) {
                hill.difficulty = 11;
            }
            var line = this.drawPoly(hill.path, hill.difficulty);

            var infoContent = '<h1 id="firstHeading" class="firstHeading">' + hill.name + '</h1><p>' + '<b>Distance:</b> ' + hill.distance + '<br />' + '<b>Decline:</b> ' + hill.decline + 'm<br />' + '<b>Busstop:</b> ' + hill.busstop + '<br />' + '<b>Difficulty:</b> ' + hill.difficulty + '/10<br />' + '<b>Traffic:</b> ' + hill.traffic + '/10<br />' + '<b>Info:</b> ' + hill.extra + '</p>';
            var infoWindow = new google.maps.InfoWindow({
                content: infoContent,
                maxWidth: 400
            });

            var marker = new google.maps.Marker({
                position: hill.path[0],
                map: this.mapHandler.map,
                title: hill.name
            });

            var open = infoWindow.open.bind(infoWindow, this.mapHandler.map, marker);
            line.addListener('click', open);
            marker.addListener('click', open);

            this.overlayHandler.addHill(hill, open);
        }
    }, {
        key: 'drawPoly',
        value: function drawPoly(points, difficulty) {
            var line = new google.maps.Polyline({
                path: points,
                strokeColor: difficultyColors[difficulty - 1],
                strokeOpacity: .7,
                strokeWeight: 3,
                map: this.mapHandler.map
            });

            return line;
        }
    }]);

    return HillLoader;
})();

exports.HillLoader = HillLoader;

},{"./mapHandler":4,"./overlayHandler":5}],3:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

require('./formHandler');

var _hillLoader = require('./hillLoader');

var _mapHandler = require('./mapHandler');

var hillLoader;

$(function () {
    new Main();
});

var Main = function Main() {
    _classCallCheck(this, Main);

    _mapHandler.MapHandler.getMapHandler();
    hillLoader = new _hillLoader.HillLoader();
    hillLoader.loadHills();
};

},{"./formHandler":1,"./hillLoader":2,"./mapHandler":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var instance;

var MapHandler = (function () {
    function MapHandler() {
        _classCallCheck(this, MapHandler);

        var mapCanvas = $('#map')[0];
        var mapOptions = {
            center: { lat: 57.7, lng: 11.98 },
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            streetViewControl: true,
            panControl: false,
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_TOP
            },
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.TERRAIN],
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
            }
        };
        this.map = new google.maps.Map(mapCanvas, mapOptions);
    }

    _createClass(MapHandler, null, [{
        key: 'getMapHandler',
        value: function getMapHandler() {
            if (instance === undefined) {
                instance = new MapHandler();
            }
            return instance;
        }
    }]);

    return MapHandler;
})();

exports.MapHandler = MapHandler;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _mapHandler = require('./mapHandler');

var instance;

var OverlayHandler = (function () {
    function OverlayHandler() {
        _classCallCheck(this, OverlayHandler);

        this.hills = [];
        this.element = $('#overlay');
    }

    _createClass(OverlayHandler, [{
        key: 'addHill',
        value: function addHill(hill, fn) {
            var id = this.hills.length;
            this.hills.push({ hill: hill, fn: fn });

            this.element.find('ul').append('<li onclick="OverlayHandler.selectHill(' + id + ');">' + hill.name + '<div style="background: ' + difficultyColors[hill.difficulty - 1] + '"> </div></li>');
        }
    }], [{
        key: 'selectHill',
        value: function selectHill(i) {
            instance.hills[i].fn();
            _mapHandler.MapHandler.getMapHandler().map.setCenter(instance.hills[i].hill.path[0]);
        }
    }, {
        key: 'getOverlayHandler',
        value: function getOverlayHandler() {
            if (instance === undefined) {
                instance = new OverlayHandler();
            }
            return instance;
        }
    }, {
        key: 'toggleOverlay',
        value: function toggleOverlay() {
            if ($('#overlay').find('ul').height()) {
                OverlayHandler.hideOverlay();
            } else {
                OverlayHandler.showOverlay();
            }
        }
    }, {
        key: 'showOverlay',
        value: function showOverlay() {
            $('#overlay').find('ul').removeClass('hidden');
            $('#openSearch').show();
        }
    }, {
        key: 'hideOverlay',
        value: function hideOverlay() {
            $('#overlay').find('ul').addClass('hidden');
            $('#overlay').find('input#search').addClass('hidden');
            $('#openSearch').hide();
        }
    }, {
        key: 'toggleSearch',
        value: function toggleSearch() {
            var search = $('#overlay #search');
            if (search.hasClass('hidden')) {
                search.removeClass('hidden');
                search.focus();
            } else {
                search.addClass('hidden');
                OverlayHandler.emptySearch();
            }
        }
    }, {
        key: 'search',
        value: function search(term) {
            var hills = $('#overlay ul li').each(function (i, li) {
                if ($(li).text().toLowerCase().indexOf(term.toLowerCase()) === -1) {
                    $(li).hide();
                } else {
                    $(li).show();
                }
            });
        }
    }, {
        key: 'emptySearch',
        value: function emptySearch(focus) {
            var search = $('#search');
            search.val('');
            search.trigger('onkeyup');
            if (focus) {
                search.focus();
            }
        }
    }]);

    return OverlayHandler;
})();

exports.OverlayHandler = OverlayHandler;

window.OverlayHandler = OverlayHandler;

},{"./mapHandler":4}],6:[function(require,module,exports){
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
        var decline = Math.round(Math.abs(elevation[0].elevation - elevation[1].elevation));
        callback(decline);
    });
}

function isFloat(str) {
    return !isNaN(str) && str.toString().indexOf('.') != -1;
}

function gMapsUrlPointParser(url, callback) {
    var directions = {
        origin: {},
        destination: {},
        waypoints: []
    };
    url = url.substring(url.indexOf("/maps/dir/") + "/maps/dir/".length);
    var urlComponents = url.split('/');

    var first = urlComponents[0].split(',');
    var second = urlComponents[1].split(',');
    if (first.length === 2 && isFloat(first[0]) && isFloat(first[1])) {
        directions['origin'].lat = parseFloat(first[0]);
        directions['origin'].lng = parseFloat(first[1]);
    }
    if (second.length === 2 && isFloat(second[0]) && isFloat(second[1])) {
        directions['destination'].lat = parseFloat(second[0]);
        directions['destination'].lng = parseFloat(second[1]);
    }

    var data = urlComponents[3];
    while (data && data.indexOf('!1d') !== -1) {
        data = data.substring(data.indexOf('!1d') + '!1d'.length);
        var lng = data.substring(0, data.indexOf('!'));
        lng = parseFloat(lng);
        data = data.substring(data.indexOf('!2d') + '!2d'.length);
        var lat = data.substring(0, data.indexOf('!'));
        lat = parseFloat(lat);

        if (directions.origin.lat === undefined) {
            directions.origin = { lat: lat, lng: lng };
        } else {
            directions.waypoints.push({ location: { lat: lat, lng: lng }, stopover: false });
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
