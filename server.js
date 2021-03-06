"use strict"

var storage = require('node-persist'),
    md5 = require('md5'),
    bodyParser = require('body-parser'),
    serveStatic = require('serve-static'),
    express = require('express'),
    app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use('/build', serveStatic(__dirname + "/build/"));
app.use('/', serveStatic(__dirname + "/src/"));

storage.initSync({
    dir: 'data.js'
});

var hills = storage.getItem('hills');
if (typeof hills === 'undefined') {
    emptyData();
}

app.get('/getHills', (req, res) => {
    res.json(hills);
});

app.post('/removeHill', (req, res) => {
    if (md5(req.body.password) === '534488729ab74ff059356cb58c9907ef') {
        hills.splice(req.body.index, 1);
        persist();
        res.end('success');
    } else {
        res.end('wrong password');
    }
});

app.post('/addHill', (req, res) => {
    var hill = req.body.hill;
    parseCoordinates(hill);
    hills.push(hill);
    persist();
    res.end();
});

function parseCoordinates(hill) {
    hill.path = hill.path.map(point => {
        return {lat: parseFloat(point.lat), lng: parseFloat(point.lng)}
    });
}

function persist() {
    storage.setItem('hills', hills);
}

function emptyData() {
    hills = [];
    persist();
}

var server = app.listen(8083, () => {
    let host = server.address().address;
    let port = server.address().port;

    console.log('Listening...');
});
