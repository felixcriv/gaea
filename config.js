(function() {
    /*jslint node: true */
    'use strict';

    var Config = (function() {

        var Config = function() {};


        Config.prototype.options = (function options() {

            return {
                server: 'http://www.funvisis.gob.ve',
                recent_events: '/sis_reciente.php',
                post_data: {
                    'xjxfun': 'actualizar',
                    'xjxr': new Date().getTime()
                }
            };
        })();

        return Config;
    })();

    if (typeof module != 'undefined' && module.exports != 'undefined') {
        module.exports = new Config();
    } else {
        window.Config = new Config();
    }
})();