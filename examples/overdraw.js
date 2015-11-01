
var Canvas = require('canvas');
var Clumsy = require('../clumsy');
var helpers = require('../helpers');
var fs = require('fs');
var path = require('path');

var canvas = new Canvas(800, 600);
var clumsy = new Clumsy(canvas);

clumsy.padding(50);
clumsy.range(0, 7, -1.5, 1.5);
clumsy.font('24px VoronovFont');

clumsy.clean('white');
clumsy.lineWidth(2);

clumsy.axis('x', 0, 7, 0.5);

clumsy.color('red');
var sine = clumsy.tabulate(0, 2*Math.PI+0.1, 0.1, Math.sin);
clumsy.overdraw(sine);

clumsy.color('black');
clumsy.axis('y', -1.5, 1.5, 0.5);

clumsy.fillTextAtCenter('График со сглаживанием', clumsy.canvas.width/2, 50);

var name = helpers.takePngName();
var out = fs.createWriteStream(path.join('./', name));
canvas.pngStream().pipe(out);
