'use strict';

//Parse HTML data from funvisis.gob.ve/sis_reciente.php to a JSON object.
//Hours are on 24H VET (VET GMT -4:30)
//NOTE: This script can fail if the website changes its HTML layout.
//At this moment there is not other suitable way to get this data.

var Q = require('q'),
    request = require('request'),
    jsdom = require("jsdom"),
    tools = require('./tools'),
    lang = require('./lang'),
    moment = require('moment-timezone'),
    colors = require('./colors');


var e = (function() {


    var options = {
        server: "http://www.funvisis.gob.ve",
        recent_events: '/sis_reciente.php',
        post_data: {
            "xjxfun": "actualizar",
            "xjxr": new Date().getTime()
        }
    };

    //returns a document HTML
    function getHTML() {
        return Q.nfcall(request,
            options.server + options.recent_events, {
                form: options.post_data
            }
        ).fail(function(err) {
            console.error(err)
            return err;
        });
    }

    //returns an array with the event properties
    function getEventProperties($) {
        var evnt = Object.create(null);

        //getting events properties
        $("thead>tr>th").each(function(index, tr) {
            if (index < 7)
                evnt[encodeURI(($(tr)[0].innerHTML)
                        .split('<br>')[0])
                    .replace(/%C3%B3/g, 'o')
                    .replace(/\./g, "")
                    .toLowerCase()] = 0;
        });

        //mapping the event properties to an array
        //so we can map our events object later
        var eventProperties = [];

        for (var k in evnt) {
            eventProperties.push(k);
        }

        return eventProperties;
    }

    //Returns events for event < currentDate
    function filterEvents(eventsObj, d) {

        var e = Object.create(null);

        var events = [];

        eventsObj.forEach(function(obj) {
            if (!tools.isEmptyObject(obj) && tools.isActualEvent(obj, d)) {

                var l = obj.localizacion.split(" ");

                obj.magnitud = 'M' + obj.magnitud;

                if (l.length > 6) {
                    obj.localizacion = l[0] + l[1] + " " + lang.translate('es', l[3]) + " of " + l[5] + " " + l[6];
                } else {
                    obj.localizacion = l[0] + l[1] + " " + lang.translate('es', l[3]) + " of " + l[5];
                }

                events.push(obj);
            }

        });

        return e.events = events;
    }

    //Returns a color string for the event
    function applyMagnitudColorForEvents(objEvents) {
        return colors.getEventsColors(objEvents);
    }

    //returns a promise that if it is resolved 
    //populates an object with the event properties/values
    function parseHTML(body, timeout) {

        timeout = timeout || 5000;

        var _r = Q.defer();

        var events = [];

        jsdom.env(body, ["http://code.jquery.com/jquery.js"],
            function(errors, window) {

                if (errors) {
                    _r.reject(errors);
                } else {

                    var $ = window.$;
                    var evntProp = getEventProperties($);

                    //remove the last five rows (it is just junk)
                    $("tbody tr").slice(-6).remove();
                    var tbody = $("tbody");

                    //we look into the second table's tbody>tr for values
                    $(tbody).find("table>tbody>tr").each(function(index, tr) {
                        var obj = Object.create(null);

                        $(tr).find('td').each(function(index, value) {

                            var img = $(value).find('a').attr('href');
                            //report image
                            if (img != undefined) {
                                obj['report'] = options.server + '/' + img;
                            }
                            //columns
                            if (index < 7) {
                                if (evntProp[index] === 'fecha') {
                                    obj[evntProp[index]] = moment($(value).text(), 'DD-MM-YYYY').format('MM/DD/YYYY');
                                } else if (evntProp[index] === 'hora') {
                                    obj[evntProp[index]] = moment($(value).text(), 'HH:mm').format('hh:mm A');
                                } else {
                                    obj[evntProp[index]] = $(value).text();
                                }
                            }
                        });

                        if (!tools.isEmptyObject(obj)) events.push(obj);

                    });

                    _r.resolve(events);
                }
            });

        timeout && setTimeout(_r.reject, timeout);
        return _r.promise;
    }

    //public API
    return {
        get: getHTML,
        parse: parseHTML,
        filter: filterEvents,
        color: applyMagnitudColorForEvents
    };

})();



exports.getEvents = function(daysToRequest, timeout) {

    return e.get().then(function(response) {
        return response[0].body;
    }).then(function(body) {
        return e.parse(body, timeout);
    }).then(function(data) {
        return e.filter(data, daysToRequest);
    }).then(e.color);
};