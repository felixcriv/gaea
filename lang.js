'use strict';

var i18n = {

    "es": {
        "norte": "N",
        "sur": "S",
        "este": "E",
        "oeste": "W",
        "sureste": "SE",
        "noreste": "NE",
        "suroeste": "SW",
        "noroeste": "NW"
    }
}

exports.translate = function(lang, str){
	return i18n[lang][str];
}