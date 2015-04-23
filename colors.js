'use strict';


var  d3 = require('d3');


//Code from https://github.com/ginaschmalzle/tohoku_eq/blob/master/mainG.js
exports.getEventsColors = function(data, color, mag) {

    var colorScale = d3.scale.linear();
    colorScale.domain([10, 4]);
    colorScale.range([100, 0]); // green to red (deepest)
    colorScale.clamp(true);

    for (var i = 0; i < data.length; i++) {

        var m = data[i][mag].split('M')[1];;
        

        var hueValue = colorScale(m);

        var c = d3.hsl(hueValue, 1, 0.5);

        data[i][color] = c.toString();
    }
    
    return data;
};