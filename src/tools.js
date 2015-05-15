(function() {
    /*jslint node: true */
    'use strict';
    var moment = require('moment-timezone');
    var Lang = require('./lang');

    var Tools = {

        isEmptyObject: function isEmptyObject(obj) {
            return !Object.keys(obj).length;
        },

        isActualEvent: function isActualEvent(date, hour, days) {
            //Events are generated on VET timezone
            var timeDiff = moment().tz('America/Caracas').diff(moment(date + ' ' + hour, 'MM-DD-YYYY hh:mm A'), 'days');
            //we only take events for the past n days
            return (timeDiff === 0 || timeDiff < days) ? true : false;
        },

        calculateTimeDiff: function calculateTimeDiff(obj, cfg) {

            var hour = obj[Lang.i18n()([cfg.language, 'data', 'hora'])];
            var date = obj[Lang.i18n()([cfg.language, 'data', 'fecha'])];
            moment.locale(cfg.language);

            var eventTime = moment(date + ' ' + hour, 'MM-DD-YYYY hh:mm A');

            obj[Lang.i18n()([cfg.language, 'data', 'ocurrido'])] = eventTime.startOf('hour').fromNow();

            return obj;
        }

        // //http://blog.stevenlevithan.com/archives/timed-memoization
        // Tools.prototype.memoize = function memoize(functor, expiration) {
        //     var memo = {};
        //     return function() {
        //         var key = Array.prototype.join.call(arguments, '§');
        //         if (key in memo){
        //             console.log('memoized');
        //             return memo[key];
        //         }
        //         if (expiration)
        //             setTimeout(function() {
        //                 delete memo[key];
        //             }, expiration);
        //         return (memo[key] = functor.apply(this, arguments));
        //     };
        // };
    };

    if (typeof module != 'undefined' && module.exports != 'undefined')
        module.exports = Object.create(Tools);
    else
        window.Tools = Object.create(Tools);
})();