(function() {
    /*jslint node: true */
    'use strict';

    var Parser = require('./parser');
    var Q = require('q');

    var ParserProxy = (function() {

        var ParserProxy = function() {};

        ParserProxy.prototype.getEvents = function getEvents(cfg) {
            try {
                if (Parser.i18n([cfg.language, 'data', 'report'])) {
                    return Parser.getHTML().then(function(response) {
                        return response[0].body;
                    }).then(function(body) {
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
                    Error: error
                });
            }
        };

        return ParserProxy;

    })();

    if (typeof module !== 'undefined' && module.exports !== 'undefined')
        module.exports = new ParserProxy();
    else
        window.ParserProxy = new ParserProxy();

})();