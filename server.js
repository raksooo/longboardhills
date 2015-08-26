var bodyParser = require('body-parser'),
    serveStatic = require('serve-static'),
    express = require('express'),
    app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use("/", serveStatic(__dirname + "/static/"));

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening at http://%s:%s', host, port);
});
