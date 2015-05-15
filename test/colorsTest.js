'use strict';

var Color = require(__dirname + '/../src/colors');
var assert = require('chai').assert;
var expect = require('chai').expect;
var Lang = require(__dirname + '/../src/lang');

describe('Color', function() {
    var _color;
    var _i18nColor;
    var _i18nMagnitude;
    var _hexColor;
    var _magScale;

    var testConfig = {
        _language: 'en-US',
        _data: [{magnitude: 'M2.7'}, 
                {magnitude: 'M4.5'}, 
                {magnitude: 'M1.3'}, 
                {magnitude: 'M3.5'}, 
                {magnitude: 'M1.0'}
                ],

        _i18n: function i18n() {
            return Lang.i18n()([].slice.call(arguments)[0]);
        }

    };

    before(function() {
        _color = Color;
        _i18nColor = testConfig._i18n([testConfig._language, "data", "color"]);
        _i18nMagnitude = testConfig._i18n([testConfig._language, "data", "magnitud"]);
        _magScale = _color.calcMagScale(testConfig._data, _i18nMagnitude);

    });

    describe('_color', function(){
        it('should create an object of Color', function(){
            assert.isObject(_color, Color, '_color is an object');
        });
    });

    describe('#getColorForEvent()', function() {

        it('should return null when value is not present', function() {
            assert.equal(null, _color.getColorForEvent());

        });

        it('should return null when missing arguments', function() {
            assert.equal(null, _color.getColorForEvent(1));

        });

        it('should return an Array when completed arguments are passed', function() {
            assert.typeOf(_color.getColorForEvent(testConfig._data, _i18nColor, _i18nMagnitude), 'array');

        });
    });

    describe('#hueColor()', function() {

        it('should return #ff5a00 for magnitude 2.7', function() {
            assert.equal('#ff5a00', _color.hueColor(_magScale(2.7)));
        });

        it('should return #ff6900 for magnitude 2.5', function() {
            assert.equal('#ff6900', _color.hueColor(_magScale(2.5)));
        });

        it('should return #ff3f00 for magnitude 3.3', function() {
            assert.equal('#ff3f00', _color.hueColor(_magScale(3.3)));
        });

    });


    describe('#maxMag()', function() {

        it('should return 4.5 as the Maximun magnitude value', function() {
            assert.equal(4.5, _color.maxMag(testConfig._data, _i18nMagnitude));
        });
    });


    describe("#minMag()", function(){
        it('should return 1.3 as the Minimun magnitude value', function() {
            assert.equal(1.0, _color.minMag(testConfig._data, _i18nMagnitude));
        });
    });


    describe("#calcMagScale()", function() {
        it('should return a function', function() {
            assert.isFunction(_color.calcMagScale(testConfig._data, _i18nMagnitude));
        });
    });
});