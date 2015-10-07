var Canvas = require('canvas');
var Clumsy = require('../clumsy');

var canvas = new Canvas(800, 600)
var clumsy = new Clumsy(canvas);
var helpers = require('../helpers');

clumsy.ctx.font = '24px VoronovFont';

clumsy.padding(100);
clumsy.range(0, 2*Math.PI, -1.5, 1.5);

clumsy.drawAxis('x', 0, 2 * Math.PI, {
    limits: [0.5, 5.5],
    step: 0.5,
    tick_size: 5
});

clumsy.fillTextAtCenter('Стрелочка', canvas.width/2, 50);

helpers.saveAsPng(clumsy);
