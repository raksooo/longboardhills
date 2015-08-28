import {MapHandler} from './mapHandler';

var overlayHandlerInstance;

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
        overlayHandlerInstance.hills[i].fn();
        MapHandler.getMapHandler().map.setCenter(overlayHandlerInstance.hills[i].hill.path[0]);
    }

    static getOverlayHandler() {
        if (overlayHandlerInstance === undefined) {
            overlayHandlerInstance = new OverlayHandler();
        }
        return overlayHandlerInstance;
    }

    static showOverlay() {
        this.element.show();
    }

    static hideOverlay() {
        this.element.hide();
    }
}

window.overlayHandler = OverlayHandler;

