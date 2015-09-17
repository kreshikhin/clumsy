var Canvas = require('canvas');
var Clumsy = require('../clumsy');

var canvas = new Canvas(800, 600)
var clumsy = new Clumsy(canvas);

clumsy.padding(100);
clumsy.range(0, 2*Math.PI, -1.5, 1.5);

var sinus = [];

for(var t=0; t < 2*Math.PI; t += 0.01){
    sinus.push({
        x: t,
        y: Math.sin(t)
    });
};

clumsy.draw(sinus);

clumsy.drawAxis('x', 0, 2 * Math.PI, {
    limits: [0.5, 5.5],
    step: 0.5,
    tick_size: 5
});

clumsy.drawAxis('y', -2, 2, {
    limits: [-1.5, 1.5],
    step: 0.5
});

clumsy.drawText('Синус', canvas.width/2, 50);

clumsy.save();
