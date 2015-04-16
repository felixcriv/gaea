
var  d3 = require('d3');


//Code from https://github.com/ginaschmalzle/tohoku_eq/blob/master/mainG.js
exports.getEventColor = function(data) {

    var colorScale = d3.scale.linear();
    colorScale.domain([0, 50]);
    colorScale.range([0, 100]); // green to red (deepest)
    colorScale.clamp(true);

    for (var i = 0; i < data.events.length; i++) {

        var d = data.events[i].prof;

        var hueValue = colorScale(d);
        var color = d3.hsl(hueValue, 1, 0.5);
        data.events[i].color = color.toString();
    }

    return data;
};