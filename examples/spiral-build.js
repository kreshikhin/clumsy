
var Canvas = require('canvas');
var GIFEncoder = require('gifencoder');
var path = require('path');
var fs = require('fs');

var Clumsy = require('clumsy');
var helpers = require('clumsy/helpers');

var Spiral = require('./spiral.js');

var canvas = new Canvas(600, 600);
var clumsy = new Clumsy(canvas);
clumsy.ctx.font = '24px VoronovFont';

var encoder = helpers.prepareEncoder(GIFEncoder, canvas);
var phase = 0;
var n = 10;

encoder.start();
for(var i = 0; i < n; i++){
    clumsy.seed(123);

    clumsy.clear('white');
    Spiral(clumsy, phase);

    phase += 2 * Math.PI / n;
    encoder.addFrame(clumsy.ctx);
};

encoder.finish();
