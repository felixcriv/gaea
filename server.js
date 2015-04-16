'use strict';

var r = require('./readAndParseHTML');
var express = require('express');

var app = express();

//3 minutes caching
var cacheTime = 180;

app.set('port', (process.env.PORT || 5000));

// Add headers
app.use(function(req, res, next) {

    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, max-age=' + cacheTime,
        'Content-length': res.length,
        'Vary': 'Accept-Encoding',
    });

    // Pass to next layer of middleware
    next();
});

app.get('/', function(req, res) {
    res.json({
        error: 'invalid call'
    });
});

app.get('/events/:days', function(req, res) {

    var days = req.params.days || 1;


    r.readAndParseHTML(days).then(
        function(data) {
            res.json(data);
        },
        function(error) {
            res.send(error);
        });
});

app.use('/', express.static(__dirname)).listen(app.get('port'));