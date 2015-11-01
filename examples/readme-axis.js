var Canvas = require('canvas');
var Clumsy = require('../clumsy');
var helpers = require('../helpers');

var canvas = new Canvas(800, 600)
var clumsy = new Clumsy(canvas);

clumsy.font('24px VoronovFont');
clumsy.padding(50);
clumsy.range(0, 7, -2, 2);
clumsy.lineWidth(2);

clumsy.axis('x', 0, 7, 0.5);
clumsy.axis('y', -2, 2, 0.5);

clumsy.color('red');
var sine = clumsy.tabulate(0, 2*Math.PI, 0.01, Math.sin);
clumsy.draw(sine);


clumsy.fillTextAtCenter('Синус', clumsy.canvas.width/2, 50);

helpers.saveAsPng(clumsy);
