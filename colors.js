(function() {
    /*jslint node: true */

    'use strict';
    var d3 = require('d3');

    var Colors = (function() {

        var colorScale = d3.scale.linear();
        colorScale.domain([2, 10]);
        colorScale.range(['green', 'red']); // green to red (deepest)
        colorScale.clamp(true);

        var magScale = d3.scale.log();
        magScale.base(10);
        magScale.range([2, 10]);

        var Colors = function() {};

        Colors.prototype.minMag = function minMag(data, mag) {
            var _min = d3.min(data, function(d) {
                return d[mag].split('M')[1];
            });

            return _min;
        };

        Colors.prototype.maxMag = function maxMag(data, mag) {
            var _max = d3.max(data, function(d) {
                return d[mag].split('M')[1];
            });

            return _max;
        };

        Colors.prototype.hueColor = function calcHUE(m) {

            if (typeof m != 'number')
                return 'null';
            var hue = d3.rgb(colorScale(m)).brighter(2.091).hsl().toString();
            return hue;
        };

        Colors.prototype.calcMagScale = function calcMagScale(data, mag) {

            var _magScale = magScale.domain([this.minMag(data, mag), this.maxMag(data, mag)]);
            return _magScale;
        };


        Colors.prototype.getColorForEvent = function getColorForEvent() {
            if (!arguments.length || arguments.length < 3) {
                return null;
            } else {
                var data = arguments[0];
                var color = arguments[1];
                var mag = arguments[2];


                //Code from https://github.com/ginaschmalzle/tohoku_eq/blob/master/mainG.js

                for (var i = 0; i < data.length; i++) {

                    var m = data[i][mag].split('M')[1] * 1;

                    var magS = this.calcMagScale(data, mag);

                    //color is calculated based on the magnitude (magScale) of the event
                    //red is the deepest

                    data[i][color] = this.hueColor(Math.round(magS(m), 2));
                    //magnitude scale is calculated based on the average of mix and Max magnitudes
                    //for the time period requested
                    data[i].magScale = Math.round(magS(m), 2);
                }

                return data;
            }

        };

        return Colors;

    })();

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
        module.exports = Colors;
    else
        window.Colors = Colors;

})();