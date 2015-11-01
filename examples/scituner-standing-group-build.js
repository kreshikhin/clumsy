
var Canvas = require('canvas');
var GIFEncoder = require('gifencoder');
var path = require('path');
var fs = require('fs');

var Clumsy = require('../clumsy');
var helpers = require('../helpers');

var Draw = require('./scituner-standing-group.js');

var canvas = new Canvas(800, 600);
var clumsy = new Clumsy(canvas);
clumsy.ctx.font = '24px VoronovFont';

var encoder = helpers.prepareEncoder(GIFEncoder, canvas);
var dt = 0;
var fps = 12;

var f = 5;
var duration = 1000; // in ms
var n = duration * fps / 1000;

clumsy.padding(100);
clumsy.range(0, 1.1, -1, 1);
clumsy.radius = 3;
clumsy.step = 10;

encoder.setDelay(duration / n)

encoder.start();
for(var i = 0; i < n; i++){
    //clumsy.seed(123);

    clumsy.clean('white');

    dt = i / (f * n);
    Draw(clumsy, f, dt);

    encoder.addFrame(clumsy.ctx);
};

encoder.finish();
