import * as routeParser from './routeParser.js';
import {HillLoader} from './hillLoader.js';

class FormHandler {
    static postform(event, form) {
        event.preventDefault();
        FormHandler.getInfo(form, FormHandler.post);
    }

    static getInfo(form, callback) {
        routeParser.newRoute(form.url.value, hill => {
            hill.name = form.name.value;
            hill.busstop = form.busstop.value;
            hill.difficulty = form.difficulty.value;
            hill.traffic = form.traffic.value;
            hill.extra = form.extra.value;

            FormHandler.fixLatLng(hill);
            callback(hill);
            form.reset();
        });
    }

    static post(hill) {
        let data = {hill: JSON.stringify(hill)};
        let hillLoader = new HillLoader();
        $.post('/addHill', data, hillLoader.loadHill.bind(hillLoader, hill));
        hideForm();
    }

    static fixLatLng(hill) {
        hill.path = $.map(hill.path, point => {
            return {lat: point.G, lng: point.K};
        });
    }

    static showForm() {
        $('#newHillForm').show();
    }

    static hideForm() {
        $('#newHillForm').hide();
    }
}

window.postform = FormHandler.postform;
window.showForm = FormHandler.showForm;
window.hideForm = FormHandler.hideForm;

