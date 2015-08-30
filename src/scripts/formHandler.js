import * as routeParser from './routeParser.js';
import {HillLoader} from './hillLoader.js';

var newHill;

class FormHandler {
    static postform(event, form) {
        event.preventDefault();
        FormHandler.getInfo(form, FormHandler.post);
    }

    static getInfo(form, callback) {
        newHill.addData(form.name.value, form.busstop.value,
                form.difficulty.value, form.traffic.value, form.extra.value);
        callback(newHill.hill)
    }

    static post(hill) {
        let data = {hill: JSON.stringify(hill)};
        let hillLoader = new HillLoader();
        $.post('/addHill', data, hillLoader.loadHill.bind(hillLoader, hill));
        FormHandler.hideForm();
    }

    static urlEntered(event, form) {
        event.preventDefault();

        newHill = new HillCreator();
        try {
            newHill.retrievePath(form.url.value, path => {
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

    static loadPreviewMap(path) {
        let mapCanvas = $('#previewMap')[0];
        let map = new google.maps.Map(mapCanvas, {
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
        let bounds = new google.maps.LatLngBounds();
        $.each(path, (i, latlng) => {
            latlng = new google.maps.LatLng(latlng.lat, latlng.lng);
            bounds.extend(latlng);
        });
        setTimeout(() => {
            google.maps.event.trigger(map, 'resize');
            map.fitBounds(bounds);
        }, 0);
    }

    static showForm(path) {
        $('#newHillUrl').show();
        $('#newHillUrl input[type="url"]').focus();
    }

    static hideForm() {
        $('#newHillUrl').hide();
        $('#newHillUrl').removeClass('error');
        $('#newHillForm').hide();
        $('#newHillUrl').find('form').first()[0].reset();
        $('#newHillForm').find('form').first()[0].reset();
    }
}

class HillCreator {
    constructor() {}

    retrievePath(url, callback) {
        routeParser.newRoute(url, hill => {
            this.hill = hill;
            this.fixLatLng();
            callback(hill.path);
        });
    }

    addData(name, busstop, difficulty, traffic, extra) {
        this.hill.name = name;
        this.hill.busstop = busstop;
        this.hill.difficulty = Math.round(difficulty);
        this.hill.traffic = Math.round(traffic);
        this.hill.extra = extra;
    }

    fixLatLng() {
        this.hill.path = $.map(this.hill.path, point => {
            return {lat: point.G, lng: point.K};
        });
    }
}

window.FormHandler = FormHandler;

