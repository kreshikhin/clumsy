
var Canvas = require('canvas');
var Clumsy = require('../clumsy');
var helpers = require('../helpers');
var fs = require('fs');
var path = require('path');

var canvas = new Canvas(800, 600);
var clumsy = new Clumsy(canvas);

clumsy.padding(100);
clumsy.range(0, 2*Math.PI, -1.5, 1.5);
clumsy.ctx.font = '24px VoronovFont';

clumsy.clean('white');

clumsy.drawAxis('x', 0, 7, 0.5);

clumsy.color('green');
var sine = clumsy.tabulate(0, 2*Math.PI, 0.1, Math.sin);
clumsy.overdraw(sine);

clumsy.color('black');
clumsy.drawAxis('y', -1.5, 1.5, 0.5);

clumsy.fillTextAtCenter('График со сглаживанием', clumsy.canvas.width/2, 50);

var name = helpers.takePngName();
var out = fs.createWriteStream(path.join('./', name));
canvas.pngStream().pipe(out);
