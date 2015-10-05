var Canvas = require('canvas');
var Clumsy = require('../clumsy');
var drawSine = require('./sine');
var path = require('path');
var fs = require('fs');


var canvas = new Canvas(800, 600)
var clumsy = new Clumsy(canvas);

drawSine(clumsy);

var name = path.basename(process.argv[1], '.js').replace('-build', '') + '.png';
var out = fs.createWriteStream(path.join('./', name));
canvas.pngStream().pipe(out);
