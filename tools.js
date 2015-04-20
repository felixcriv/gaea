'use strict';

var moment = require('moment-timezone');

exports.isEmptyObject = function(obj) {
    return !Object.keys(obj).length;
}

exports.isActualEvent = function(obj, days) {
	//Events are generated on VET timezone
    var timeDiff = moment().tz('America/Caracas').diff(moment(obj.fecha + ' ' + obj.hora, "MM-DD-YYYY hh:mm A"), 'days');
    //we only take events for the past n days
    return (timeDiff == 0 || timeDiff < days) ? true : false;

}