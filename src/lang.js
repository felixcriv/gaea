(function() {
    /*jslint node: true */
    'use strict';

    var Translate = (function() {

        var Translate = function() {};


        var lang = {

            'en-US': {

                'coordinates': {
                    'norte': 'North',
                    'sur': 'South',
                    'este': 'East',
                    'oeste': 'West',
                    'sureste': 'South East',
                    'noreste': 'North East',
                    'suroeste': 'South West',
                    'noroeste': 'North West'
                },

                'data': {
                    'fecha': 'date',
                    'hora': 'hour',
                    'latitud': 'latitude',
                    'longitud': 'longitude',
                    'prof': 'depth',
                    'magnitud': 'magnitude',
                    'report': 'report',
                    'localizacion': 'place',
                    'color': 'color',
                    'de': 'of',
                    'ocurrido': 'occurred'
                }

            },

            'it': {
                'coordinates': {
                    'norte': 'Nord',
                    'sur': 'Sud',
                    'este': 'East',
                    'oeste': 'Ovest',
                    'sureste': 'Sud-Est',
                    'noreste': 'Nord Est',
                    'suroeste': 'Sud Ovest',
                    'noroeste': 'Nord Ovest'
                },

                'data': {
                    'fecha': 'data',
                    'hora': 'ora',
                    'latitud': 'latitudine',
                    'longitud': 'longitudine',
                    'prof': 'profondita',
                    'magnitud': 'magnitudine',
                    'report': 'relazione',
                    'localizacion': 'luogo',
                    'color': 'colore',
                    'de': 'di',
                    'ocurrido': 'verificato'
                }
            }

        };


        Translate.prototype.i18n = function i18n(keys) {
            var obj = [];

            keys.forEach(function(val) {
                if (val in lang) {
                    obj = lang[val];
                } else {
                    try {
                        obj = obj[val];
                    } catch (err) {
                        obj = null;
                    }
                }
            });

            return obj;
        };

        Translate.prototype.getAvailableLanguages = function getAvailableLanguages() {
            return Object.keys(lang);
        };

        return Translate;
    })();

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
        module.exports = Translate;
    else
        window.Translate = Translate;
})();