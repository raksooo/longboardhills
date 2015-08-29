var instance;

export class MapHandler {
    constructor() {
        let mapCanvas = $('#map')[0];
        let mapOptions = {
            center: {lat: 57.7, lng: 11.98},
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            streetViewControl: true,
            panControl: false,
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
        this.map = new google.maps.Map(mapCanvas, mapOptions);
    }

    static getMapHandler() {
        if (instance === undefined) {
            instance = new MapHandler();
        }
        return instance;
    }
}

