(function() {
    /*jslint node: true */
    'use strict';

    var Config = {

        options: (function options() {

            return {
                server: 'http://www.funvisis.gob.ve',
                recent_events: '/sis_reciente.php',
                post_data: {
                    'xjxfun': 'actualizar',
                    'xjxr': new Date().getTime()
                }
            }
        })()
    };

    if (typeof module != 'undefined' && module.exports != 'undefined') {
        module.exports = Object.create(Config);
    } else {
        window.Config = Object.create(Config);
    }
})();