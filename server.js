'use strict';

var r = require('./readAndParseHTML');
var express = require('express');

var app = express();

app.set('port', (process.env.PORT || 5000));

// Add headers
app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/', function(req, res) {
    res.json({
        error: 'invalid call'
    });
});

app.get('/events', function(req, res) {

    r.readAndParseHTML().then(
        function(data) {
            res.json(data);
        },
        function(error) {
            res.send(error);
        });
}).listen(app.get('port'));

app.use('/', express.static(__dirname));