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

        "data": {
            "fecha": "date",
            "hora": "hour",
            "latitud": "latitude",
            "longitud": "longitude",
            "prof": "depth",
            "magnitud": "magnitude",
            "report": "report",
            "localizacion": "place",
            "color": "color",
            "de": "of"
        }

    },

    "it": {
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

        "data": {
            "fecha": "data",
            "hora": "ora",
            "latitud": "latitudine",
            "longitud": "longitudine",
            "prof": "profondita",
            "magnitud": "magnitudine",
            "report": "relazione",
            "localizacion": "luogo",
            "color": "colore",
            "de": "di"
        }
    }

};


exports.translate = function(keys) {
    var obj = Object.create(i18n);
    for (var i in keys[0]) {
        obj = obj[keys[0][i]];
    }
    return obj
}