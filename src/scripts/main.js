import './formHandler';
import {HillLoader} from './hillLoader';

var map, hillLoader;

$(() => {
    new Main();
});

class Main {
    constructor() {
        this.createMap();

        hillLoader = new HillLoader(map);
        hillLoader.loadHills();
    }

    createMap() {
        let mapCanvas = $('#map')[0];
        let mapOptions = {
            center: {lat: 57.7, lng: 11.98},
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
}

