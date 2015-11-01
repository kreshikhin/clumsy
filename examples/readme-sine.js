var Canvas = require('canvas');
var Clumsy = require('../clumsy');
var helpers = require('../helpers');

var canvas = new Canvas(800, 600)
var clumsy = new Clumsy(canvas);

clumsy.padding(50);
clumsy.range(0, 7, -1.5, 1.5);


var sine = clumsy.tabulate(0, 2*Math.PI, 0.01, Math.sin);
clumsy.lineWidth(2);
clumsy.color('red');
clumsy.draw(sine);

helpers.saveAsPng(clumsy); // save as png of same name
