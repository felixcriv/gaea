'use strict';

var Q = require('q'),
    request = require('request'),
    jsdom = require("jsdom"),
    libxmljs = require('libxmljs'),
    moment = require('moment'),
    d3 = require('d3');

var post_data = {
    "xjxfun": "actualizar",
    "xjxr": new Date().getTime()
};

var options = {
    server: "http://www.funvisis.gob.ve",
    recent_events: '/sis_reciente.php'
};

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

function isActualEvent(obj){

    var timeDiff =  moment().diff(moment(obj.fecha, "DD-MM-YYYY"), 'days');

    return (timeDiff == 0 || timeDiff <=1) ? true : false; 

}

function isBetween(x,a,b){
    return x>=a && x<=b;
}

//Adapted code from https://github.com/ginaschmalzle/tohoku_eq/blob/master/mainG.js
function getEventColor(data){

    var colorScale = d3.scale.linear();
    colorScale.domain([0,50]);
    colorScale.range([0,100]); // green to red (deepest)
    colorScale.clamp(true);

    for(var i = 0; i < data.events.length; i++){

        var d = data.events[i].prof;
        
        var hueValue = colorScale(d);
        var color = d3.hsl(hueValue,1,0.5);
        data.events[i].color = color.toString();
    }
};

exports.readAndParseHTML = function(timeout) {

    timeout = timeout || 5000;

    var _r = Q.defer();

    request.post(options.server + options.recent_events, {
        form: post_data
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
            // e.minMag = minMag;
            // e.maxMag = maxMag;

            jsdom.env(_derivateData.text(), ["http://code.jquery.com/jquery.js"],
                function(errors, window) {
                    var $ = window.$;
                    //getting the properties from the head
                    var thead = $("thead tr");
                    //remove the last five rows (junk)
                    $("tbody tr").slice(-5).remove();

                    var tbody = $("tbody");

                    //getting events properties
                    $("thead>tr>th").each(function(index, tr) {
                        if (index < 7)
                            evnt[encodeURI(($(tr)[0].innerHTML).split('<br>')[0]).replace(/%C3%B3/g, 'o').replace(/\./g,"").toLowerCase()] = 0;
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
                            if(img != undefined ){
                                obj['report'] = options.server + '/' + img;
                            }
                            if (index < 7)
                                obj[eventProperties[index]] = $(value).text();
                        });

                        if (!isEmptyObject(obj) && isActualEvent(obj))
                            events.push(obj);
                    });

                    getEventColor(e);

                    _r.resolve(e);
                });
        } else {
            _r.reject(error)
        }
    });

    timeout && setTimeout(_r.reject, timeout);
    return _r.promise;
};