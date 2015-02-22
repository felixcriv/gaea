'use strict';

var r = require('./readAndParseHTML');
var express = require('express');

var app = express();

app.set('port', (process.env.PORT || 5000));

// Add headers
app.use(function(req, res, next) {

    //Connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Allow
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    res.setHeader('Vary', 'Accept-Encoding'); 

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