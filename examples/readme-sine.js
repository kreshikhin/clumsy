var Canvas = require('canvas');
var Clumsy = require('clumsy');
var helpers = require('clumsy/helpers');

var canvas = new Canvas(800, 600)
var clumsy = new Clumsy(canvas);

clumsy.padding(100);
clumsy.range(0, 2*Math.PI, -1.5, 1.5);

var sine = [];

for(var t=0; t < 2*Math.PI; t += 0.01){
    sine.push({
        x: t,
        y: Math.sin(t)
    });
};

clumsy.draw(sine);

helpers.saveAsPng(clumsy); // save as png of same name
