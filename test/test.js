require("chai").should();
global._ = require('underscore');
global.Backbone = require('backbone');

var Mixin = require('../backbone.nativeview');
console.log(Mixin);

global._.extend(global.Backbone.View.prototype, Mixin);

describe('Backbone.NativeView', function() {
});