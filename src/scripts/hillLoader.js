import {OverlayHandler} from './overlayHandler';
import {MapHandler} from './mapHandler';

var mapHandler, overlayHandler;

export class HillLoader {
    constructor() {
        if (mapHandler === undefined) {
            mapHandler = MapHandler.getMapHandler();
        }
        if (overlayHandler === undefined) {
            overlayHandler = OverlayHandler.getOverlayHandler();
        }
    }

    loadHills() {
        $.get('/getHills', data => {
            $.each(data, (i, hill) => {
                this.loadHill(hill);
            }.bind(this));
        }.bind(this));
    }

    loadHill(hill) {
        let line = this.drawPoly(hill.path);

        let infoContent = '<h1 id="firstHeading" class="firstHeading">' + hill.name + '</h1><p>' +
            '<b>Distance:</b> ' + hill.distance + '<br />' +
            '<b>Decline:</b> ' + hill.decline + 'm<br />' +
            '<b>Busstop:</b> ' + hill.busstop + '<br />' +
            '<b>Difficulty:</b> ' + hill.difficulty + '/10<br />' +
            '<b>Traffic:</b> ' + hill.traffic + '/10<br />' +
            '<b>Info:</b> ' + hill.extra + '</p>';
        let infoWindow = new google.maps.InfoWindow({
            content: infoContent,
            maxWidth: 400
        });

        let marker = new google.maps.Marker({
            position: hill.path[0],
            map: mapHandler.map,
            title: hill.name
        });

        let open = infoWindow.open.bind(infoWindow, mapHandler.map, marker);
        line.addListener('click', open);
        marker.addListener('click', open);

        overlayHandler.addHill(hill, open);
    }

    drawPoly(points) {
        let line = new google.maps.Polyline({
            path: points,
            strokeColor: "#FF00AA",
            strokeOpacity: .7,
            strokeWeight: 3,
            map: mapHandler.map
        });

        return line;
    }
}

