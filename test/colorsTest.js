'use strict';

var assert = require("assert");
var Color = require('./../colors');
var assert = require('chai').assert;
var expect = require('chai').expect;

describe('Color', function() {
    var _color;

    beforeEach(function() {
        _color = new Color();

    });

    describe('#getColorForEvent()', function() {

        it('should return null when value is not present', function() {
            assert.equal(null, _color.getColorForEvent());

        });

        it('should return null when missing arguments', function() {
            assert.equal(null, _color.getColorForEvent(1));

        });

        it('should return an Object when completed arguments are passed', function() {
            assert.typeOf(_color.getColorForEvent({}, 3, 2), 'object');

        });
    });

    describe('#calHUE()', function() {

        it('should return #ff1700 for magnitude 2.7', function() {
            assert.equal('#ff1700', _color.calcHUE(2.7).toString());
        });

        it('should return #ff1500 for magnitude 2.5', function() {
            assert.equal('#ff1500', _color.calcHUE(2.5).toString());
        });

        it('should return #ff1c00 for magnitude 3.3', function() {
            assert.equal('#ff1c00', _color.calcHUE(3.3).toString());
        });

        it('should return "null" if magnitude is an string', function() {
            assert.equal('null', _color.calcHUE('as3').toString());
        });



    });

});