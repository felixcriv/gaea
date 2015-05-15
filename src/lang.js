(function() {
    /*jslint node: true */
    'use strict';

    //var Tools = require('./tools');

    var Translate = {

        lang: {

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

        },

        i18n: function i18n() {

            var self = this;
            var obj = [];

            return function(keys) {

                keys.forEach(function(val) {
                    if (val in self.lang) {
                        obj = self.lang[val];
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
        },

        getAvailableLanguages: function getAvailableLanguages() {
            return Object.keys(this.lang);
        }
    };

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
        module.exports = Object.create(Translate);
    else
        window.Translate = Object.create(Translate);
})();