
var Canvas = require('canvas');
var Clumsy = require('clumsy');
var helpers = require('clumsy/helpers');
var fs = require('fs');
var path = require('path');

var canvas = new Canvas(800, 600);
var clumsy = new Clumsy(canvas);

clumsy.padding(100);
clumsy.range(0, 2*Math.PI, -1.5, 1.5);
clumsy.ctx.font = '24px VoronovFont';

clumsy.radius = 30;
clumsy.step = 1;

var sine = [];

for(var t=0; t < 2*Math.PI; t += 0.1){
    sine.push({x: t, y: Math.sin(t), mark: ''});
};

clumsy.draw(sine);
clumsy.fillTextAtCenter('Неправильный шаг', clumsy.canvas.width/2, 50);

var name = helpers.takePngName();
var out = fs.createWriteStream(path.join('./', name));
canvas.pngStream().pipe(out);
