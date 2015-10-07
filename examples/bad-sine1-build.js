
var Canvas = require('canvas');
var Clumsy = require('clumsy');
var helpers = require('clumsy/helpers');

var canvas = new Canvas(800, 600);
var clumsy = new Clumsy(canvas);

var sine = [];

for(var t=0; t < 2*Math.PI; t += 0.1){
    sine.push({x: t, y: Math.sin(t) });
};

console.log(sine);

clumsy.draw(sine);

var name = helpers.takePngName();
var out = fs.createWriteStream(path.join('./', name));
canvas.pngStream().pipe(out);
