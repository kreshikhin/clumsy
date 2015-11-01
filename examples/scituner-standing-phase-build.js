
var Canvas = require('canvas');
var GIFEncoder = require('gifencoder');
var path = require('path');
var fs = require('fs');

var Clumsy = require('../clumsy');
var helpers = require('../helpers');

var Draw = require('./scituner-standing-phase.js');

var canvas = new Canvas(800, 600);
var clumsy = new Clumsy(canvas);

var encoder = helpers.prepareEncoder(GIFEncoder, canvas);

var fps = 12;
var duration = 3000; // duration of GID, in ms
var n = duration * fps / 1000;
encoder.setDelay(duration / n)

encoder.start();
for(var i = 0; i < n; i++){
    Draw(clumsy, 2 * i / n - 1);
    encoder.addFrame(clumsy.ctx);
};

encoder.finish();
