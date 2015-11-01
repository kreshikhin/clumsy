
var Canvas = require('canvas');
var Clumsy = require('../clumsy');
var helpers = require('../helpers');
var fs = require('fs');
var path = require('path');

var canvas = new Canvas(800, 600);
var clumsy = new Clumsy(canvas);

clumsy.padding(50);
clumsy.range(0, 2*Math.PI, -1.5, 1.5);
clumsy.font('24px VoronovFont');

clumsy.radius(20);
clumsy.step(30);
clumsy.lineWidth(2);

var sine = clumsy.tabulate(0, 2*Math.PI, 0.25, function(t){
    return {x: t, y: Math.sin(t), mark: '', normal: {x:0, y:0}};
});

sine = clumsy.rescale(sine);

clumsy.ctx.beginPath();
clumsy.ctx.moveTo(sine[0].x, sine[0].y);

for(var i=0; i < sine.length; i++){
    clumsy.ctx.lineTo(
        sine[i].x + clumsy.radius() * (Math.random() - 0.5),
        sine[i].y + clumsy.radius() * (Math.random() - 0.5));
};
clumsy.ctx.stroke();

clumsy.fillTextAtCenter('Без сглаживания', clumsy.canvas.width/2, 50);

var name = helpers.takePngName();
var out = fs.createWriteStream(path.join('./', name));
canvas.pngStream().pipe(out);
