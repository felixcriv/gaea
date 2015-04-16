var moment = require('moment');

exports.isEmptyObject = function(obj) {
    return !Object.keys(obj).length;
}

exports.isActualEvent = function(obj, days) {

    var timeDiff = moment().diff(moment(obj.fecha, "DD-MM-YYYY"), 'days');
    //we only take events for the past n days 
    return (timeDiff == 0 || timeDiff <= days) ? true : false;

}