'use strict';

var Q = require('q'),
    request = require('request'),
    jsdom = require("jsdom"),
    libxmljs = require('libxmljs'),
    tools = require('./tools'),
    colors = require('./colors'),
    days = 1;


var options = {
    server: "http://www.funvisis.gob.ve",
    recent_events: '/sis_reciente.php',
    post_data: {
        "xjxfun": "actualizar",
        "xjxr": new Date().getTime()
    }
};


exports.readAndParseHTML = function(d, timeout) {

    timeout = timeout || 5000;
    days = d;

    var _r = Q.defer();

    request.post(options.server + options.recent_events, {
        form: options.post_data
    }, function(error, response, body) {

        if (!error && response.statusCode == 200) {
            //parsing the XML to an object we can handle later
            var xmlDoc = libxmljs.parseXml(body);
            //getting the last 'known' node for the data
            var _derivateData = xmlDoc.get('/xjx/cmd[last()]');

            var evnt = Object.create(null);

            var e = Object.create(null);

            var events = [];
            e.events = events;

            jsdom.env(_derivateData.text(), ["https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"],
                function(errors, window) {

                    if (errors) {
                        _r.reject(errors);
                    } else {

                        var $ = window.$;
                        //getting the properties from the head
                        var thead = $("thead tr");
                        //remove the last five rows (it is just junk)
                        $("tbody tr").slice(-5).remove();

                        var tbody = $("tbody");

                        //getting events properties
                        $("thead>tr>th").each(function(index, tr) {
                            if (index < 7)
                                evnt[encodeURI(($(tr)[0].innerHTML).split('<br>')[0]).replace(/%C3%B3/g, 'o').replace(/\./g, "").toLowerCase()] = 0;
                        });

                        //mapping the event properties to an array
                        //so we can map our events object later
                        var eventProperties = [];

                        for (var k in evnt) {
                            eventProperties.push(k);
                        }
                        //we look into the tbody for properties
                        $(tbody).find("tr").each(function(index, tr) {
                            var obj = Object.create(null);
                            $(tr).find('td').each(function(index, value) {
                                var img = $(value).find('a').attr('href');
                                if (img != undefined) {
                                    obj['report'] = options.server + '/' + img;
                                }
                                if (index < 7)
                                    obj[eventProperties[index]] = $(value).text();
                            });

                            if (!tools.isEmptyObject(obj) && tools.isActualEvent(obj, days))
                                events.push(obj);
                        });

                        _r.resolve(colors.getEventColor(e));
                    }
                });
        } else {
            _r.reject(error)
        }
    });

    timeout && setTimeout(_r.reject, timeout);
    return _r.promise;
};