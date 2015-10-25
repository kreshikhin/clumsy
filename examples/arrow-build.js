var Canvas = require('canvas');
var Clumsy = require('../clumsy');

var canvas = new Canvas(800, 600)
var clumsy = new Clumsy(canvas);
var helpers = require('../helpers');

clumsy.ctx.font = '24px VoronovFont';

clumsy.padding(100);
clumsy.range(-3, 3, -1.5, 1.5);

clumsy.drawAxis('x', -2.5, 2.5, {
    limits: [-2, 2],
    step: 0.5,
    tick_size: 5
});

clumsy.fillTextAtCenter('Стрелочка', canvas.width/2, 50);

helpers.saveAsPng(clumsy);