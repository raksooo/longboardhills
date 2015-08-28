function postform(event, form) {
    event.preventDefault();

    getInfo(form, function(hill) {
        post(hill);
    });
}

function getInfo(form, callback) {
    newRoute(form.url.value, function(hill) {
        hill.name = form.name.value;
        hill.busstop = form.busstop.value;
        hill.difficulty = form.difficulty.value;
        hill.traffic = form.traffic.value;
        hill.extra = form.extra.value;

        fixLatLng(hill);
        callback(hill);
    });
}

function post(hill) {
    var data = {hill: JSON.stringify(hill)};
    $.post('/addHill', data, function() {
        addHill(hill);
    });
}

function fixLatLng(hill) {
    hill.path = $.map(hill.path, function(point) {
        return {lat: point.G, lng: point.K};
    });
}

