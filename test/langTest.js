'use strict';

var assert = require('chai').assert;
var expect = require('chai').expect;
var Translate = require(__dirname + '/../src/lang');


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
        }]
    };

    describe('#getAvailableLanguages', function() {
        it('return languages available in the library to include: en-US, it', function() {
            expect(Translate.getAvailableLanguages()).to.include('en-US', 'it');
        });
    });


    describe('#i18n', function() {
        it('Will return "hour" for string "hora" in en-US', function() {
            expect(Translate.i18n()([_testConfig._language, "data", "hora"])).to.be.equal('hour');
        });

        it('Will return "ora" for string "hora" in it', function() {
            expect(Translate.i18n()(['it', "data", "hora"])).to.be.equal('ora');
        });

        it('Will return undefined for a non-existing translation key', function() {
            expect(Translate.i18n()(['it', "data", "tiempo"])).to.be.undefined;
        });

        it('Will return undefined for a non-existing translation key property', function() {
            expect(Translate.i18n()([_testConfig._language, "data", "profundidad"])).to.be.undefined;
        });
    });

});