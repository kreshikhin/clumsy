var Canvas = require('canvas');
var Clumsy = require('../clumsy');

var canvas = new Canvas(800, 600)
var clumsy = new Clumsy(canvas);
var helpers = require('../helpers');

clumsy.ctx.font = '24px VoronovFont';

clumsy.padding(100);
clumsy.range(0, 7, -1.5, 1.5);

clumsy.clean();

clumsy.color('black');
clumsy.lineWidth(2);
clumsy.axis('x', 0, 7, 1);
clumsy.axis('y', -1.5, 1.5, 0.5);

var sine = clumsy.tabulate(0, 2*Math.PI, 0.05, Math.sin);
clumsy.color('green');
clumsy.lineWidth(3);
clumsy.overdraw(sine);

var cosine = clumsy.tabulate(0, 2*Math.PI, 0.05, Math.cos);
clumsy.color('blue');
clumsy.lineWidth(3);
clumsy.overdraw(cosine);



clumsy.fillTextAtCenter('Hello!', canvas.width/2, 50);

helpers.saveAsPng(clumsy);
