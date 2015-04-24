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

    function i18n() {
        return new lang().i18n([].slice.call(arguments));

    }

    function createPlaceName(place) {
        var _p = place.slice(0);
        _p.splice(0, 5);
        var p = [];
        _p.forEach(function(d) {
            p.push(d);
        });

        return p.join(" ");
    }

    //Returns events for event < currentDate
    function filterEvents(eventsObj, cfg) {

        var e = Object.create(null);
        var events = [];

        eventsObj.forEach(function(obj) {

            var date = obj[i18n([cfg.language, 'data', "fecha"])];
            var hour = obj[i18n([cfg.language, 'data', "hora"])];
            var location = i18n([cfg.language, 'data', "localizacion"]);
            var l = obj[location].split(" ");

            if (!tools.isEmptyObject(obj) && tools.isActualEvent(date, hour, cfg.daysToRequest)) {

                var sentence_preposition = i18n([cfg.language, "data", "de"]);
                var place = i18n([cfg.language, 'coordinates', l[3]]);
                var magnitude = i18n([cfg.language, 'data', "magnitud"]);

                obj[magnitude] = 'M' + obj[magnitude];
                obj[location] = l[0] + l[1] + " " + place + " " + sentence_preposition + " " + createPlaceName(l);

                events.push(obj);
            }
        });

        return e.events = events;
    }

    //Returns a color string for the event
    function applyMagnitudColorForEvents(objEvents, cfg) {
        var c = i18n([cfg.language, 'data', "color"]);
        var m = i18n([cfg.language, 'data', "magnitud"]);


        return colors.getEventsColors(objEvents, c, m);
    }

    //returns a promise that if it is resolved 
    //populates an object with the event properties/values
    function parseHTML(body, cfg) {

        cfg.timeout = cfg.timeout || 5000;

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

                    
                    var reportImage;
                    var imagePlaceholder = 'http://dummyimage.com/300x300/000/fff.png&text=no+report+yet';
                    var imageUrl;
                    var img;

                    //we look into the second table's tbody>tr for values
                    $(tbody).find("table>tbody>tr").each(function(index, tr) {
                        var obj = Object.create(null);

                        $(tr).find('td').each(function(index, value) {

                            img = $(value).find('a').attr('href');
                            
                            reportImage = (options.server + '/' + img);

                            if(img != undefined){
                                imageUrl = reportImage
                            }

                            obj[i18n([cfg.language, "data", "report"])] = imageUrl || imagePlaceholder;
                            
                            //columns
                            if (index < 7) {
                                var prop = evntProp[index];

                                if (prop === 'fecha') {
                                    obj[i18n([cfg.language, "data", prop])] = moment($(value).text(), 'DD-MM-YYYY').format('MM/DD/YYYY');
                                } else if (evntProp[index] === 'hora') {
                                    obj[i18n([cfg.language, "data", prop])] = moment($(value).text(), 'HH:mm').format('hh:mm A');
                                } else {
                                    obj[i18n([cfg.language, "data", prop])] = $(value).text();
                                }
                            }
                        });

                        if (!tools.isEmptyObject(obj)) events.push(obj);

                    });

                    _r.resolve(events);
                }
            });

        cfg.timeout && setTimeout(_r.reject, cfg.timeout);
        return _r.promise;
    }

    //public API
    return {
        get: getHTML,
        parse: parseHTML,
        filter: filterEvents,
        color: applyMagnitudColorForEvents,
        i18n: i18n
    };

})();



exports.getEvents = function(cfg) {

    return e.get().then(function(response) {
        return response[0].body;
    }).then(function(body) {
        return e.parse(body, cfg);
    }).then(function(data) {
        return e.filter(data, cfg);
    }).then(function(data) {
        return e.color(data, cfg)
    });
};