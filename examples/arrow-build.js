var createCanvas = require('canvas').createCanvas;
var Clumsy = require('../clumsy');

var canvas = createCanvas(800, 600)
var clumsy = new Clumsy(canvas);
var helpers = require('../helpers');

clumsy.font('24px VoronovFont');

clumsy.padding(100);
clumsy.range(-3, 3, -1.5, 1.5);

clumsy.axis('x', -2.5, 2.5, 0.5);


clumsy.fillTextAtCenter('Arrow', canvas.width/2, 50);

helpers.saveAsPng(clumsy);
