var storage = require('node-persist'),
    sassMiddleware = require('node-sass-middleware'),
    path = require('path'),
    bodyParser = require('body-parser'),
    serveStatic = require('serve-static'),
    express = require('express'),
    app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(sassMiddleware({
    src: path.join(__dirname, 'static'),
    dest: path.join(__dirname, 'build', 'styles'),
    debug: true,
    outputStyle: 'compressed',
    prefix: '/styles'
}));
// TODO: Flytta upp nedanstående så att inte scss:en kompileras varje sidhämtning
app.use('/script', serveStatic(__dirname + "/build/"));
app.use('/', serveStatic(__dirname + "/static/"));

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

app.get('/emptyData', (req, res) => {
    emptyData();
    res.end();
});

app.post('/addHill', (req, res) => {
    var hill = JSON.parse(req.body.hill);
    hills.push(hill);
    storage.setItem('hills', hills);
    res.end();
});

function emptyData() {
    hills = [];
    storage.setItem('hills', hills);
}

var server = app.listen(3000, () => {
    let host = server.address().address;
    let port = server.address().port;

    console.log('Listening at http://%s:%s', host, port);
});
