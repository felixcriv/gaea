'use strict';

var i18n = {

    "en-US": {

        "coordinates": {
            "norte": "North",
            "sur": "South",
            "este": "East",
            "oeste": "West",
            "sureste": "South East",
            "noreste": "North East",
            "suroeste": "South West",
            "noroeste": "North West"
        },

        "de": "of"
    },

    "it":{
        "coordinates": {
            "norte": "Nord",
            "sur": "Sud",
            "este": "East",
            "oeste": "Ovest",
            "sureste": "Sud-Est",
            "noreste": "Nord Est",
            "suroeste": "Sud Ovest",
            "noroeste": "Nord Ovest"
        },

        "de": "di"
    }

}

exports.translate = function(lang, str) {
    return i18n[lang]['coordinates'][str] + " " + i18n[lang]['de'];
}