'use strict';

var parser = require('./parser');
var express = require('express');
var compress = require('compression');

var app = express();

//3 minutes caching
var cacheTime = 180;

app.set('port', (process.env.PORT || 5000));

//gzip compression
app.use(compress());

app.get('/', function(req, res) {
    res.json({
        error: 'invalid call'
    });
});

app.get('/events/:days?', function(req, res) {

     res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, max-age=' + cacheTime,
        'Content-length': res.length
    });


    var config = {
        timeout: 5000,
        daysToRequest : req.params.days || 1,
        language: req.query.l
    };

    console.log(config);

    parser.getEvents(config).then(
        function(data) {
            res.json(data);
        },
        function(error) {
            res.send(error);
        });
});

app.use('/', express.static(__dirname)).listen(app.get('port'));