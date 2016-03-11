import {OverlayHandler} from './overlayHandler';
import {MapHandler} from './mapHandler';

window.difficultyColors = [
    "#2E7D32",
    "#558B2F",
    "#9E9D24",
    "#F9A825",
    "#FF8F00",
    "#EF6C00",
    "#D84315",
    "#C62828",
    "#283593",
    "#111111",
    "#000000"
];

export class HillLoader {
    constructor() {
        this.mapHandler = MapHandler.getMapHandler();
        this.overlayHandler = OverlayHandler.getOverlayHandler();
    }

    loadHills() {
        $.get('/getHills', (data => {
            $.each(data, ((i, hill) => {
                this.loadHill(hill);
            }).bind(this));
        }).bind(this));
    }

    loadHill(hill) {
        if (hill.difficulty === 0) {
            hill.difficulty = 11;
        }
        let line = this.drawPoly(hill.path, hill.difficulty);

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
            map: this.mapHandler.map,
            title: hill.name
        });

        let open = infoWindow.open.bind(infoWindow, this.mapHandler.map, marker);
        line.addListener('click', open);
        marker.addListener('click', open);

        this.overlayHandler.addHill(hill, open);
    }

    drawPoly(points, difficulty) {
        let line = new google.maps.Polyline({
            path: points,
            strokeColor: difficultyColors[difficulty - 1],
            strokeOpacity: .7,
            strokeWeight: 3,
            map: this.mapHandler.map
        });

        return line;
    }
}

