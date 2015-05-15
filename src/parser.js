(function() {
    /*jslint node: true */
    'use strict';

    //Parse HTML data from funvisis.gob.ve/sis_reciente.php to a JSON object.
    //Hours are on 24H VET (VET GMT -4:30)
    //NOTE: This script can fail if the website changes its HTML layout.

    var Q = require('q'),
        request = require('request'),
        jsdom = require('jsdom'),
        tools = require('./tools'),
        Translate = require('./lang'),
        moment = require('moment-timezone'),
        config = require('./config'),
        Colors = require('./colors');

    //returns an array with the event properties
    var getEventProperties = function getEventProperties($) {
        var evnt = Object.create(null);

        //getting events properties
        $('thead>tr>th').each(function(index, tr) {
            if (index < 7)
                evnt[encodeURI(($(tr)[0].innerHTML)
                        .split('<br>')[0])
                    .replace(/%C3%B3/g, 'o')
                    .replace(/\./g, '')
                    .toLowerCase()] = 0;
        });

        //mapping the event properties to an array
        //so we can map our events object later
        var eventProperties = [];

        for (var k in evnt) {
            eventProperties.push(k);
        }

        return eventProperties;
    };

    var createPlaceName = function createPlaceName(place) {
        var _p = place.slice(0);
        _p.splice(0, 5);
        var p = [];
        _p.forEach(function(d) {
            p.push(d);
        });

        return p.join(' ');
    };


    var Parser = {

        //returns a document HTML
        getHTML: function getHTML() {

            return Q.nfcall(request,
                config.options.server + config.options.recent_events, {
                    form: config.options.post_data
                }
            ).fail(function(err) {
                return err;
            });
        },


        //Returns events for event < currentDate
        filterEvents: function filterEvents(eventsObj, cfg) {

            var e = Object.create(null);
            var events = [];

            eventsObj.forEach(function(obj) {

                var date = obj[Translate.i18n()([cfg.language, 'data', 'fecha'])];
                var hour = obj[Translate.i18n()([cfg.language, 'data', 'hora'])];
                var location = Translate.i18n()([cfg.language, 'data', 'localizacion']);

                var l = obj[location].split(' ');

                if (!tools.isEmptyObject(obj) && tools.isActualEvent(date, hour, cfg.daysToRequest)) {

                    var sentence_preposition = Translate.i18n()([cfg.language, 'data', 'de']);
                    var place = Translate.i18n()([cfg.language, 'coordinates', l[3]]);
                    var magnitude = Translate.i18n()([cfg.language, 'data', 'magnitud']);

                    obj[magnitude] = 'M' + obj[magnitude];
                    obj[location] = l[0] + l[1] + ' ' + place + ' ' + sentence_preposition + ' ' + createPlaceName(l);

                    events.push(obj);
                }
            });

            e.events = events;

            return e.events;
        },

        //Returns a color string for all the events
        applyMagnitudColorForEvents: function applyMagnitudColorForEvents(objEvents, cfg) {

            var c = Translate.i18n()([cfg.language, 'data', 'color']);
            var m = Translate.i18n()([cfg.language, 'data', 'magnitud']);
            return Colors.getColorForEvent(objEvents, c, m);
        },

        //returns a promise that if it is resolved 
        //populates an object with the event properties/values
        parseHTML: function parseHTML(body, cfg) {

            cfg.timeout = cfg.timeout || 5000;

            var _r = Q.defer();

            var events = [];

            jsdom.env(body, ['http://code.jquery.com/jquery.js'],
                function(errors, window) {

                    if (errors) {
                        _r.reject(errors);
                    } else {

                        var $ = window.$;
                        var evntProp = getEventProperties($);

                        //remove the last five rows (it is just junk)
                        $('tbody tr').slice(-6).remove();
                        var tbody = $('tbody');


                        var reportImage;
                        var imagePlaceholder = 'http://dummyimage.com/300x300/000/fff.png&text=no+report+yet';

                        var img;

                        //we look into the second table's tbody>tr for values
                        $(tbody).find('table>tbody>tr').each(function(index, tr) {
                            var obj = Object.create(null);
                            var imageUrl;
                            $(tr).find('td').each(function(index, value) {

                                img = $(value).find('a').attr('href');

                                reportImage = (config.options.server + '/' + img);


                                if (img !== undefined) {
                                    imageUrl = reportImage;
                                }

                                obj[Translate.i18n()([cfg.language, 'data', 'report'])] = imageUrl || imagePlaceholder;

                                //columns
                                if (index < 7) {
                                    var prop = evntProp[index];

                                    if (prop === 'fecha') {
                                        obj[Translate.i18n()([cfg.language, 'data', prop])] = moment($(value).text(), 'DD-MM-YYYY').format('MM/DD/YYYY');
                                    } else if (evntProp[index] === 'hora') {
                                        obj[Translate.i18n()([cfg.language, 'data', prop])] = moment($(value).text(), 'HH:mm').format('hh:mm A');
                                    } else {
                                        obj[Translate.i18n()([cfg.language, 'data', prop])] = $(value).text();
                                    }
                                }
                            });

                            if (!tools.isEmptyObject(obj)) events.push(tools.calculateTimeDiff(obj, cfg));

                        });

                        _r.resolve(events);
                    }
                });

            if (cfg.timeout) setTimeout(_r.reject, cfg.timeout);

            return _r.promise;
        }

    };


    if (typeof module !== 'undefined' && module.exports !== undefined)
        module.exports = Object.create(Parser);
    else
        window.Parser = Object.create(Parser);

})();