import {MapHandler} from './mapHandler';

var instance;

export class OverlayHandler {
    constructor() {
        this.hills = [];
        this.element = $('#overlay');
    }

    addHill(hill, fn) {
        let id = this.hills.length;
        this.hills.push({hill: hill, fn: fn});

        this.element.find('ul').append('<li onclick="overlayHandler.selectHill(' + id + ');">' + hill.name + '</li>');
    }

    static selectHill(i) {
        instance.hills[i].fn();
        MapHandler.getMapHandler().map.setCenter(instance.hills[i].hill.path[0]);
    }

    static getOverlayHandler() {
        if (instance === undefined) {
            instance = new OverlayHandler();
        }
        return instance;
    }

    static showOverlay() {
        this.element.show();
    }

    static hideOverlay() {
        this.element.hide();
    }
}

window.overlayHandler = OverlayHandler;

