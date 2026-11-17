var createCanvas = require('canvas').createCanvas;
var Clumsy = require('../clumsy');
var drawSine = require('./sine');
var path = require('path');
var fs = require('fs');


var canvas = createCanvas(800, 600)
var clumsy = new Clumsy(canvas);

drawSine(clumsy);

var name = path.basename(process.argv[1], '.js').replace('-build', '') + '.png';
var out = fs.createWriteStream(path.join('./', name));
canvas.createPNGStream().pipe(out);
