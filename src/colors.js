(function() {
    /*jslint node: true */

    'use strict';
    var d3 = require('d3');

    var colorScale = d3.scale.linear();
    colorScale.domain([2, 10]);
    colorScale.range(['green', 'red']); // green to red (deepest)
    colorScale.clamp(true);

    var magScale = d3.scale.log();
    magScale.base(10);
    magScale.range([2, 10]);

    var Colors = {


        minMag: function minMag(data, mag) {
            var _min = d3.min(data, function(d) {
                return d[mag].split('M')[1];
            });
            return _min;
        },

        maxMag: function maxMag(data, mag) {
            var _max = d3.max(data, function(d) {
                return d[mag].split('M')[1];
            });
            return _max;
        },

        hueColor: function calcHUE(m) {
            if (typeof m != 'number')
                return 'null';
            var hue = d3.rgb(colorScale(m)).brighter(2.091).hsl().toString();
            return hue;
        },

        calcMagScale: function calcMagScale(data, mag) {

            var _magScale = magScale.domain([this.minMag(data, mag), this.maxMag(data, mag)]);
            return _magScale;
        },


        getColorForEvent: function getColorForEvent() {
            if (!arguments.length || arguments.length < 3) {
                return null;
            } else {
                var data = arguments[0];
                var color = arguments[1];
                var mag = arguments[2];

                //Code adapted from https://github.com/ginaschmalzle/tohoku_eq/blob/master/mainG.js

                return data.map(function(property) {
                    var m = property[mag].split('M')[1] *1;

                    //---------- we can memoize this functions ----------

                    //color is calculated based on the magnitude (magScale) of the event
                    //red is the deepest
                    var magS = this.calcMagScale(data, mag);

                    property[color] = this.hueColor(Math.round(magS(m), 2));

                    //--------------------------
                    //magnitude scale is calculated based on the average of mix and Max magnitudes
                    //for the time period requested
                    property.magscale = Math.round(magS(m), 2);

                    return property;

                }.bind(Colors));

            }
        }
    };

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
        module.exports = Object.create(Colors);
    else
        window.Colors = Object.create(Colors);

})();