'use strict';

var Q = require('q'),
    request = require('request'),
    jsdom = require("jsdom"),
    tools = require('./tools'),
    lang = require('./lang'),
    colors = require('./colors');


var options = {
    server: "http://www.funvisis.gob.ve",
    recent_events: '/sis_reciente.php',
    post_data: {
        "xjxfun": "actualizar",
        "xjxr": new Date().getTime()
    }
};

function getHTML(opt) {
    return Q.nfcall(request,
        opt.server + opt.recent_events, {
            form: opt.post_data
        }
    ).fail(function(err) {
        console.error(err)
        return err;
    });
}

function parseHTML(body, d, timeout) {

    timeout = timeout || 5000;

    var _r = Q.defer();
    var evnt = Object.create(null);
    var e = Object.create(null);

    var events = [];
    e.events = events;

    jsdom.env(body, ["http://code.jquery.com/jquery.js"],
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
                        if (index < 7){
                            obj[eventProperties[index]] = $(value).text();
                        }
                    });

                    if (!tools.isEmptyObject(obj) && tools.isActualEvent(obj, d)){
                        var l = obj.localizacion.split(" ");
                        obj.magnitud = 'M'+obj.magnitud;
                        
                        if(l.length >6){
                            obj.localizacion = l[0] + l[1]+ " " + lang.translate('es', l[3]) + " of "  + l[5] + " " + l[6];
                        }else{
                            obj.localizacion = l[0] + l[1]+ " " + lang.translate('es', l[3]) + " of "  + l[5];
                        }
                        
                        events.push(obj);
                    }
                        
                });
                
                _r.resolve(colors.getEventColor(e));
            }
        });

    timeout && setTimeout(_r.reject, timeout);
    return _r.promise;
}


exports.getEvents = function(d, timeout) {

    return getHTML(options).then(function(response) {
        return response[0].body;
    }).then(function(body) {
        return parseHTML(body, d, timeout);
    });
};