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

        this.element.find('ul').append('<li onclick="OverlayHandler.selectHill(' + id + ');">' + hill.name + '<div style="background: ' + difficultyColors[hill.difficulty-1] + '"> </div></li>');
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

    static toggleOverlay() {
        if ($('#overlay').find('ul').height()) {
            OverlayHandler.hideOverlay();
        } else {
            OverlayHandler.showOverlay();
        }
    }

    static showOverlay() {
        $('#overlay').find('ul').removeClass('hidden');
        $('#openSearch').show();
    }

    static hideOverlay() {
        $('#overlay').find('ul').addClass('hidden');
        $('#overlay').find('input#search').addClass('hidden');
        $('#openSearch').hide();
    }

    static toggleSearch() {
        let search = $('#overlay #search');
        if (search.hasClass('hidden')) {
            search.removeClass('hidden');
            search.focus();
        } else {
            search.addClass('hidden');
            OverlayHandler.emptySearch();
        }
    }

    static search(term) {
        let hills = $('#overlay ul li').each(function(i, li) {
            if ($(li).text().toLowerCase().indexOf(term.toLowerCase()) === -1) {
                $(li).hide();
            } else {
                $(li).show();
            }
        });
    }

    static emptySearch(focus) {
        let search = $('#search');
        search.val('');
        search.trigger('onkeyup');
        if (focus) {
            search.focus();
        }
    }
}

window.OverlayHandler = OverlayHandler;

