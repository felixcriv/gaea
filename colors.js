'use strict';

var d3 = require('d3');

// (function() {

//     var Colors = (function() {

//         var Colors = function() {};

//         Colors.prototype.getColorForEvent = function getColorForEvent() {
//             if (!arguments.length || arguments.length < 2) {
//                 return null
//             } else {
//                 var color = arguments[0];
//                 var mag = arguments[1];

//                 var colorScale = d3.scale.linear();
//                 colorScale.domain([0, 50]);
//                 colorScale.range([0, 100]); // green to red (deepest)
//                 colorScale.clamp(true);

//                 // var minMag = d3.min(data, function(d) {
//                 //     return d[mag].split('M')[1];
//                 // });

//                 // var maxMag = d3.max(data, function(d) {
//                 //     return d[mag].split('M')[1];
//                 // });

//                 //magnitude scale for animation or drawing purposes
//                 var magScale = d3.scale.log();
//                 magScale.base(10);
//                 //magScale.domain([minMag, maxMag]);
//                 magScale.range([1, 30]);

//                 // for (var i = 0; i < data.length; i++) {

//                 //     var m = data[i][mag].split('M')[1];;


//                 //     var hueValue = colorScale(m);

//                 //     var c = d3.hsl(hueValue, 1, 0.5);

//                 //     data[i][color] = c.toString();
//                 //     data[i]['magScale'] = magScale(m) * 2;
//                 // }

//                 return "color";
//             }

//         };

//         return Colors;

//     })();

//     if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
//         module.exports = Colors;
//     else
//         window.Colors = Colors;

// })();

function initColor (){

    var c = 0;

    return function(){
        c++;
        console.log(c);
    }
}



//Code from https://github.com/ginaschmalzle/tohoku_eq/blob/master/mainG.js
exports.getEventsColors = function(data, color, mag) {
    var c = initColor();
    
    var colorScale = d3.scale.linear();
    colorScale.domain([0, 50]);
    colorScale.range([0, 100]); // green to red (deepest)
    colorScale.clamp(true);

    var minMag = d3.min(data, function(d) {
        return d[mag].split('M')[1];
        c();
    });

    var maxMag = d3.max(data, function(d) {
        return d[mag].split('M')[1];
    });


    //magnitude scale for animation or drawing purposes
    var magScale = d3.scale.log();
    magScale.base(10);
    magScale.domain([minMag, maxMag]);
    magScale.range([1, 30]);

    for (var i = 0; i < data.length; i++) {

        var m = data[i][mag].split('M')[1];;


        var hueValue = colorScale(m);

        var c = d3.hsl(hueValue, 1, 0.5);

        data[i][color] = c.toString();
        data[i]['magScale'] = magScale(m)*2;
    }

    return data;
};