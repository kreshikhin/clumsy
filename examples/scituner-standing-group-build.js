
var createCanvas = require('canvas').createCanvas;
var GIFEncoder = require('gifencoder');
var path = require('path');
var fs = require('fs');

var Clumsy = require('../clumsy');
var helpers = require('../helpers');

var Draw = require('./scituner-standing-group.js');

var canvas = createCanvas(800, 600);
var clumsy = new Clumsy(canvas);

var encoder = helpers.prepareEncoder(GIFEncoder, canvas);

var fps = 12;
var duration = 1000; // duration of GIF, in ms
var n = duration * fps / 1000;

encoder.setDelay(duration / n);
encoder.start();

for(var i = 0; i < n; i++){
    Draw(clumsy, i / n);
    encoder.addFrame(clumsy.ctx);
};

encoder.finish();
