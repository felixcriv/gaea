'use strict';

var assert = require('chai').assert;
var expect = require('chai').expect;
var lang = require(__dirname + '/../lang');


describe('i18n', function() {
    var _testConfig = {
        _language: 'en-US',
        _data: [{
            magnitude: 'M2.7'
        }, {
            magnitude: 'M4.5'
        }, {
            magnitude: 'M1.3'
        }, {
            magnitude: 'M3.5'
        }, {
            magnitude: 'M1.0'
        }],

        _translate: function i18n() {
            return new lang();
        }


    };

    describe('#getAvailableLanguages', function() {
        it('return languages available in the library to include: en-US, it', function() {
            expect(_testConfig._translate().getAvailableLanguages()).to.include('en-US', 'it');
        });
    });


    describe('#i18n', function() {
        it('Will return "hour" for string "hora" in en-US', function() {
            expect(_testConfig._translate().i18n([_testConfig._language, "data", "hora"])).to.be.equal('hour');
        });

        it('Will return "ora" for string "hora" in it', function() {
            expect(_testConfig._translate().i18n(['it', "data", "hora"])).to.be.equal('ora');
        });

        it('Will return undefined for a non-existing translation key', function() {
            expect(_testConfig._translate().i18n(['it', "data", "tiempo"])).to.be.undefined;
        });

        it('Will return undefined for a non-existing translation key property', function() {
            expect(_testConfig._translate().i18n([_testConfig._language, "data", "profundidad"])).to.be.undefined;
        });
    });

});