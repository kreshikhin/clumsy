var Canvas = require('canvas');
var Clumsy = require('clumsy');
var helpers = require('clumsy/helpers');

var canvas = new Canvas(800, 600)
var clumsy = new Clumsy(canvas);

clumsy.ctx.font = '24px VoronovFont';
clumsy.padding(100);
clumsy.range(0, 7, -1.5, 1.5);

var sine = [];

for(var t=0; t < 2*Math.PI; t += 0.01){
    sine.push({
        x: t,
        y: Math.sin(t)
    });
};

clumsy.draw(sine);

clumsy.drawAxis('x', 0, 7, {
    limits: [0.5, 6.5],
    step: 0.5,
    tick_size: 5
});

clumsy.ctx.fillStyle = 'black';

clumsy.drawAxis('y', -2, 2, {
    limits: [-1.5, 1.5],
    step: 0.5
});

clumsy.fillTextAtCenter('Синус', clumsy.canvas.width/2, 50);

helpers.saveAsPng(clumsy);
