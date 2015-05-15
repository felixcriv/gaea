(function() {
    /*jslint node: true */
    'use strict';

    var Parser = require('./parser');
    var Translate = require('./lang');
    var Q = require('q');

    var ParserProxy = {

        getEvents: function getEvents(cfg) {
            try {
                if (Translate.i18n()([cfg.language, 'data', 'report'])) {

                    return Parser.getHTML().then(function(response) {
                            return response[0].body;
                        })
                        .then(function(body) {
                            return Parser.parseHTML(body, cfg);
                        }).then(function(data) {
                            return Parser.filterEvents(data, cfg);
                        }).then(function(data) {
                            return Parser.applyMagnitudColorForEvents(data, cfg);
                        });
                } else {
                    return Q.reject({
                        API_error: 'Language not defined'
                    });
                }
            } catch (error) {
                return Q.reject({
                    Error: error.toString()
                });
            }
        }

    };

    if (typeof module !== 'undefined' && module.exports !== 'undefined')
        module.exports = Object.create(ParserProxy);
    else
        window.ParserProxy = Object.create(ParserProxy);

})();