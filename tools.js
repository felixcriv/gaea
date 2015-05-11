(function() {
    /*jslint node: true */
    'use strict';
    var moment = require('moment-timezone');
    var Lang = require('./lang');

    var Tools = (function() {

        var Tools = function() {};

        function i18n() {
            return new Lang().i18n([].slice.call(arguments)[0]);
        }

        Tools.prototype.isEmptyObject = function isEmptyObject(obj) {
            return !Object.keys(obj).length;

        };

        Tools.prototype.isActualEvent = function isActualEvent(date, hour, days) {
            //Events are generated on VET timezone
            var timeDiff = moment().tz('America/Caracas').diff(moment(date + ' ' + hour, 'MM-DD-YYYY hh:mm A'), 'days');
            //we only take events for the past n days
            return (timeDiff === 0 || timeDiff < days) ? true : false;
        };

        Tools.prototype.calculateTimeDiff = function calculateTimeDiff(obj, cfg) {

            var hour = obj[i18n([cfg.language, 'data', 'hora'])];
            var date = obj[i18n([cfg.language, 'data', 'fecha'])];
            moment.locale(cfg.language);

            var eventTime = moment(date + ' ' + hour, 'MM-DD-YYYY hh:mm A');

            obj[i18n([cfg.language, 'data', 'ocurrido'])] = eventTime.startOf('hour').fromNow();

            return obj;

        };

        return Tools;

    })();

    if (typeof module != 'undefined' && module.exports != 'undefined')
        module.exports = new Tools();
    else
        window.Tools = new Tools();
})();